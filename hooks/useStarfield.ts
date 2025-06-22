import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { C } from '@/lib/starfield/constants';

import {
  createStarBuffers, buildStars, buildLines,
  buildPulsePoints, buildTailPoints, LinesBuilt,
} from '@/lib/starfield/builders';
import { updateStarfield } from '@/lib/starfield/physics';
import {
  createPulseState, spawnPulseBurst,
  updatePulses, writePulseBuffers, TAIL_LEN,
} from '@/lib/starfield/pulses';

import { getPopTexture } from '@/lib/getPopTexture';


export const STAR_MESH = 'STAR_MESH'
export const LINE_MESH = 'LINE_MESH'

/* 안전 dispose */
const disposeMat = (m: THREE.Material | THREE.Material[]) =>
  Array.isArray(m) ? m.forEach(mm => mm.dispose()) : m.dispose();

export function useStarfield() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    /*──── 1. 기본 ────*/
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 1, 2000,
    );
    camera.position.z = 450;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('#000');
    mountRef.current.appendChild(renderer.domElement);

    /*──── 2. 메쉬 ────*/
    const starBuf = createStarBuffers();
    const starBaseCol = starBuf.colors;
    const starDispCol = new Float32Array(starBaseCol);
    const { mesh: starMesh, geo: starGeo, mat: starMat } =
      buildStars(starBuf.positions, starDispCol);
    starMesh.name = STAR_MESH
    const { mesh: lineMesh, geo: lineGeo, mat: lineMat,
            pairs, colors: lineColors }: LinesBuilt =
      buildLines(starBuf.positions, starBaseCol);
    lineMesh.name = LINE_MESH
    const { mesh:pulseMesh, geo:pulseGeo,
            positions:pulsePos, colors:pulseCol } =
      buildPulsePoints(C.PULSE.maxCount);

    const tailBuild = buildTailPoints(C.PULSE.maxCount * TAIL_LEN);
    if (tailBuild) scene.add(tailBuild.mesh);

    scene.add(starMesh, lineMesh, pulseMesh);

    /*──── 3. 포인터 ────*/
    const ray=new THREE.Raycaster(), nd=new THREE.Vector2();
    const plane=new THREE.Plane(new THREE.Vector3(0,0,1),0);
    const ptr=new THREE.Vector3(),  prev=new THREE.Vector3();
    window.addEventListener('pointermove',e=>{
      nd.x=(e.clientX/window.innerWidth)*2-1;
      nd.y=-(e.clientY/window.innerHeight)*2+1;
      ray.setFromCamera(nd,camera); ray.ray.intersectPlane(plane,ptr);
    });

    /*──── 4. 상태 버퍼 ────*/
    const starCnt=C.STAR.count;
    const twPhase = new Float32Array(starCnt);
    const flashAmt   = new Float32Array(starCnt);
    const flashPhase = new Float32Array(starCnt);
    for(let i=0;i<starCnt;i++) twPhase[i]=Math.random()*Math.PI*2;

    const pulseState = createPulseState();
    const pairCnt = pairs.length/2;
    const trailRemain=new Float32Array(pairCnt);
    const trailDuration=new Float32Array(pairCnt);
    const trailColor=new Float32Array(pairCnt*3);

    /*──── Pop 스프라이트 리스트 ────*/
    type Pop={ sprite:THREE.Sprite; scale:number };
    const pops:Pop[]=[];

    /*──── 5. 루프 ────*/
    const starPos=starBuf.positions;
    const linePos=lineGeo.attributes.position.array as Float32Array;
    let time=0, id=0;
    const loop=()=>{ id=requestAnimationFrame(loop); time+=C.STAR.twinkleSpeed;

      /* 별 twinkle + flash */
      for(let i=0;i<starCnt;i++){
        const idx=i*3;
        const tw=1+C.STAR.twinkleRange*Math.sin(time+twPhase[i]);
        let fl=0;
        if(flashAmt[i]>0.01){
          flashPhase[i]+= (Math.PI*2*C.STAR.flashBlinkFreq)*C.STAR.twinkleSpeed;
          fl=flashAmt[i]*Math.abs(Math.sin(flashPhase[i]));
          flashAmt[i]*=C.STAR.flashDecay;
        }
        const factor=tw+fl;
        for(let c=0;c<3;c++)
          starDispCol[idx+c]=Math.min(starBaseCol[idx+c]*factor,1);
      }
      starGeo.attributes.color.needsUpdate=true;

      /* 별 물리 */
      updateStarfield(starBuf,[ptr.x,ptr.y,ptr.z],ptr.distanceTo(prev));
      prev.copy(ptr); starGeo.attributes.position.needsUpdate=true;

      /* 선 위치 */
      for(let k=0;k<pairs.length;k+=2){
        const ai=pairs[k]*3, bi=pairs[k+1]*3, dst=k*3;
        linePos.set([starPos[ai],starPos[ai+1],starPos[ai+2],
                     starPos[bi],starPos[bi+1],starPos[bi+2]],dst);
      }
      lineGeo.attributes.position.needsUpdate=true;

      /* Pulse 발사 */
      let active=0; for(let i=0;i<trailRemain.length;i++) if(trailRemain[i]>0) active++;
      for(let p=0;p<pairs.length&&active<C.TRAIL.maxActive;p+=2){
        if(Math.random()<C.PULSE.spawnProb){
          const ai=pairs[p]*3, bi=pairs[p+1]*3;
          const from=new THREE.Vector3(starPos[ai],starPos[ai+1],starPos[ai+2]);
          const to=new THREE.Vector3(starPos[bi],starPos[bi+1],starPos[bi+2]);
          const clr=new THREE.Color(starBaseCol[ai],starBaseCol[ai+1],starBaseCol[ai+2]);
          spawnPulseBurst(from,to,clr,C.PULSE.burstCount,pulseState);

          const idx=p/2;
          trailDuration[idx]=C.TRAIL.minLife+
            Math.random()*(C.TRAIL.maxLife-C.TRAIL.minLife);
          trailRemain[idx]=trailDuration[idx];
          trailColor.set(clr.toArray(),idx*3);
          active++;
        }
      }

      /* Pulse 이동 & 버퍼 */
      const finished=updatePulses(1,pulseState);
      writePulseBuffers(pulseState,pulsePos,pulseCol);
      pulseGeo.setDrawRange(0,pulseState.pulses.length);
      pulseGeo.attributes.position.needsUpdate=true;
      pulseGeo.attributes.color.needsUpdate=true;

      /* Tail(옵션) */
      if(TAIL_LEN&&tailBuild){
        let tIdx=0;
        for(const p of pulseState.pulses){
          for(let n=0;n<p.trail.length;n++){
            const pos=p.trail[n], f=(1-n/TAIL_LEN)**2;
            tailBuild.positions.set([pos.x,pos.y,pos.z],tIdx*3);
            tailBuild.colors.set([p.color.r*f,p.color.g*f,p.color.b*f],tIdx*3);
            tIdx++;
          }
        }
        tailBuild.geo.setDrawRange(0,tIdx);
        tailBuild.geo.attributes.position.needsUpdate=true;
        tailBuild.geo.attributes.color.needsUpdate=true;
      }

      /* Pulse 충돌 → Pop 생성 & flash */
      for(const {pos,color} of finished){
        let near=0,min=Infinity;
        for(let i=0;i<starPos.length;i+=3){
          const dx=starPos[i]-pos.x,dy=starPos[i+1]-pos.y,dz=starPos[i+2]-pos.z,
                d2=dx*dx+dy*dy+dz*dz;
          if(d2<min){min=d2;near=i;}
        }
        /* 색 블렌드 & flash */
        starBaseCol[near]   =THREE.MathUtils.lerp(starBaseCol[near],   color.r,0.7);
        starBaseCol[near+1] =THREE.MathUtils.lerp(starBaseCol[near+1], color.g,0.7);
        starBaseCol[near+2] =THREE.MathUtils.lerp(starBaseCol[near+2], color.b,0.7);
        flashAmt[near/3]=C.STAR.flashBoostInit; flashPhase[near/3]=0;

        /* ★ Pop 스프라이트 */
        const mat=new THREE.SpriteMaterial({
          map: getPopTexture(), color, transparent:true,
          depthWrite:false, blending:THREE.AdditiveBlending,
        });
        const spr=new THREE.Sprite(mat);
        spr.position.set(pos.x,pos.y,pos.z);
        spr.scale.setScalar(C.STAR.popSize);
        scene.add(spr);
        pops.push({sprite:spr,scale:C.STAR.popSize});
      }

      /* Pop 업데이트 */
      for(let i=pops.length-1;i>=0;i--){
        const p=pops[i];
        p.scale*=C.STAR.popDecay;
        (p.sprite.material as THREE.SpriteMaterial).opacity*=C.STAR.popDecay;
        p.sprite.scale.setScalar(p.scale);
        if(p.scale<1){
          scene.remove(p.sprite);
          disposeMat(p.sprite.material);
          pops.splice(i,1);
        }
      }

      /* Trail 선 페이드 */
      for(let i=0;i<trailRemain.length;i++){
        if(trailRemain[i]<=0) continue;
        const ratio=trailRemain[i]/trailDuration[i], base=i*6;
        const r=trailColor[i*3]*ratio, g=trailColor[i*3+1]*ratio, b=trailColor[i*3+2]*ratio;
        lineColors.set([r,g,b,r,g,b],base);
        trailRemain[i]-=C.TRAIL.fadeStep;
      }
      lineGeo.attributes.color.needsUpdate=true;

      /* 회전 & 렌더 */
      scene.rotation.y+=0.0006; scene.rotation.x+=0.0003;
      renderer.render(scene,camera);
    };
    loop();

    /*──── 해제 ────*/
    const resize=()=>{
      camera.aspect=window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth,window.innerHeight);
    };
    window.addEventListener('resize',resize);

    return ()=>{
      cancelAnimationFrame(id);
      window.removeEventListener('resize',resize);
      mountRef.current?.removeChild(renderer.domElement);

      starGeo.dispose(); disposeMat(starMat);
      lineGeo.dispose(); disposeMat(lineMat);
      pulseGeo.dispose(); disposeMat(pulseMesh.material);
      if(tailBuild){ tailBuild.geo.dispose(); disposeMat(tailBuild.mesh.material);}
      pops.forEach(p=>disposeMat(p.sprite.material));
      renderer.dispose();
    };
  }, []);

  return mountRef;
}
