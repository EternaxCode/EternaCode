import { useEffect } from 'react';
import * as THREE from 'three';
import { C } from '@/lib/starfield/constants';
import { updateStarfield } from '@/lib/starfield/physics';
import {
  createPulseState, spawnPulseBurst, updatePulses, writePulseBuffers, TAIL_LEN,
} from '@/lib/starfield/pulses';
import { getPopTexture } from '@/lib/getPopTexture';
import { MeshBundle } from './useStarMeshes';

type Ctx = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
};

/** requestAnimationFrame 루프 */
export function useStarfieldLoop(
  ctx: Ctx | null,
  meshes: MeshBundle | null,
  pointer: THREE.Vector3,
  pointerSpeed: () => number
) {
  
  useEffect(() => {
  if (!ctx || !meshes) return;
    const { scene, camera, renderer } = ctx;
    const {
      starBuf, starMesh, lineInfo,
      pulseInfo, tail,
    } = meshes;

    /* --- 상태 버퍼 --- */
    const starCnt      = C.STAR.count;
    const twPhase      = new Float32Array(starCnt);
    const flashAmt     = new Float32Array(starCnt);
    const flashPhase   = new Float32Array(starCnt);
    for (let i = 0; i < starCnt; i++) twPhase[i] = Math.random() * Math.PI * 2;

    const pulseState = createPulseState();

    const pairCnt        = lineInfo.pairs.length / 2;
    const trailRemain    = new Float32Array(pairCnt);
    const trailDuration  = new Float32Array(pairCnt);
    const trailColor     = new Float32Array(pairCnt * 3);

    type Pop = { sprite: THREE.Sprite; scale: number };
    const pops: Pop[] = [];

    const starPos   = starBuf.positions;
    const starBase  = starBuf.colors;
    const starDisp  = (starMesh.geometry as THREE.BufferGeometry).attributes.color.array as Float32Array;

    const linePos   = lineInfo.geo.attributes.position.array as Float32Array;
    const lineColor = lineInfo.geo.attributes.color.array    as Float32Array;
    const pairs     = lineInfo.pairs;

    const pulsePos  = pulseInfo.positions;
    const pulseCol  = pulseInfo.colors;
    const pulseGeo  = pulseInfo.geo;

    const tailPos   = tail?.positions;
    const tailCol   = tail?.colors;
    const tailGeo   = tail?.geo;

    /* --- 루프 --- */
    let time = 0;
    let raf  = 0;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      time += C.STAR.twinkleSpeed;

      /* 1) 별 twinkle & flash */
      for (let i = 0; i < starCnt; i++) {
        const idx = i * 3;
        const tw  = 1 + C.STAR.twinkleRange * Math.sin(time + twPhase[i]);
        let fl    = 0;
        if (flashAmt[i] > 0.01) {
          flashPhase[i] += (Math.PI * 2 * C.STAR.flashBlinkFreq) * C.STAR.twinkleSpeed;
          fl = flashAmt[i] * Math.abs(Math.sin(flashPhase[i]));
          flashAmt[i] *= C.STAR.flashDecay;
        }
        const f = tw + fl;
        starDisp[idx]   = Math.min(starBase[idx]   * f, 1);
        starDisp[idx+1] = Math.min(starBase[idx+1] * f, 1);
        starDisp[idx+2] = Math.min(starBase[idx+2] * f, 1);
      }
      (starMesh.geometry as THREE.BufferGeometry).attributes.color.needsUpdate = true;

      /* 2) 별 위치(포인터 피하기) */
      updateStarfield(starBuf, [pointer.x, pointer.y, pointer.z], pointerSpeed());
      (starMesh.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;

      /* 3) 연결선 위치 업데이트 */
      for (let k = 0; k < pairs.length; k += 2) {
        const ai = pairs[k] * 3, bi = pairs[k + 1] * 3, dst = k * 3;
        linePos.set([
          starPos[ai],   starPos[ai + 1],   starPos[ai + 2],
          starPos[bi],   starPos[bi + 1],   starPos[bi + 2],
        ], dst);
      }
      lineInfo.geo.attributes.position.needsUpdate = true;

      /* 4) Pulse 발사 & Trail 관리 */
      let activeTrails = 0;
      for (let i = 0; i < trailRemain.length; i++) if (trailRemain[i] > 0) activeTrails++;

      for (let p = 0; p < pairs.length && activeTrails < C.TRAIL.maxActive; p += 2) {
        if (Math.random() < C.PULSE.spawnProb) {
          const ai = pairs[p] * 3, bi = pairs[p + 1] * 3;
          const from = new THREE.Vector3(starPos[ai], starPos[ai + 1], starPos[ai + 2]);
          const to   = new THREE.Vector3(starPos[bi], starPos[bi + 1], starPos[bi + 2]);
          const clr  = new THREE.Color(
            starBase[ai], starBase[ai + 1], starBase[ai + 2]
          );
          spawnPulseBurst(from, to, clr, C.PULSE.burstCount, pulseState);

          const idx = p / 2;
          trailDuration[idx] = C.TRAIL.minLife +
            Math.random() * (C.TRAIL.maxLife - C.TRAIL.minLife);
          trailRemain[idx] = trailDuration[idx];
          trailColor.set(clr.toArray(), idx * 3);
          activeTrails++;
        }
      }

      /* 5) Pulse 이동 & 버퍼 기록 */
      const finished = updatePulses(1, pulseState);
      writePulseBuffers(pulseState, pulsePos, pulseCol);
      pulseGeo.setDrawRange(0, pulseState.pulses.length);
      pulseGeo.attributes.position.needsUpdate = true;
      pulseGeo.attributes.color.needsUpdate = true;

      /* 6) Tail */
      if (TAIL_LEN && tailGeo && tailPos && tailCol) {
        let tIdx = 0;
        for (const p of pulseState.pulses) {
          for (let n = 0; n < p.trail.length; n++) {
            const pos = p.trail[n], f = (1 - n / TAIL_LEN) ** 2;
            tailPos.set([pos.x, pos.y, pos.z], tIdx * 3);
            tailCol.set([p.color.r * f, p.color.g * f, p.color.b * f], tIdx * 3);
            tIdx++;
          }
        }
        tailGeo.setDrawRange(0, tIdx);
        tailGeo.attributes.position.needsUpdate = true;
        tailGeo.attributes.color  .needsUpdate = true;
      }

      /* 7) Pulse 충돌 → Pop & Flash */
      for (const { pos, color } of finished) {
        let nearest = 0, minD2 = Infinity;
        for (let i = 0; i < starPos.length; i += 3) {
          const dx = starPos[i] - pos.x, dy = starPos[i + 1] - pos.y, dz = starPos[i + 2] - pos.z;
          const d2 = dx*dx + dy*dy + dz*dz;
          if (d2 < minD2) { minD2 = d2; nearest = i; }
        }

        starBase[nearest]   = THREE.MathUtils.lerp(starBase[nearest],   color.r, 0.7);
        starBase[nearest+1] = THREE.MathUtils.lerp(starBase[nearest+1], color.g, 0.7);
        starBase[nearest+2] = THREE.MathUtils.lerp(starBase[nearest+2], color.b, 0.7);
        flashAmt[nearest / 3] = C.STAR.flashBoostInit;
        flashPhase[nearest / 3] = 0;

        /* Pop */
        const mat = new THREE.SpriteMaterial({
          map: getPopTexture(), color, transparent: true,
          depthWrite: false, blending: THREE.AdditiveBlending,
        });
        const spr = new THREE.Sprite(mat);
        spr.position.copy(pos);
        spr.scale.setScalar(C.STAR.popSize);
        scene.add(spr);
        pops.push({ sprite: spr, scale: C.STAR.popSize });
      }

      /* 8) Pop 업데이트 */
      for (let i = pops.length - 1; i >= 0; i--) {
        const p = pops[i];
        p.scale *= C.STAR.popDecay;
        (p.sprite.material as THREE.SpriteMaterial).opacity *= C.STAR.popDecay;
        p.sprite.scale.setScalar(p.scale);
        if (p.scale < 1) {
          scene.remove(p.sprite);
          disposeSpr(p.sprite);
          pops.splice(i, 1);
        }
      }

      /* 9) Trail 색 페이드 */
      for (let i = 0; i < trailRemain.length; i++) {
        if (trailRemain[i] <= 0) continue;
        const ratio = trailRemain[i] / trailDuration[i];
        const base  = i * 6;
        const r = trailColor[i*3]   * ratio;
        const g = trailColor[i*3+1] * ratio;
        const b = trailColor[i*3+2] * ratio;
        lineColor.set([r, g, b, r, g, b], base);
        trailRemain[i] -= C.TRAIL.fadeStep;
      }
      lineInfo.geo.attributes.color.needsUpdate = true;

      /* 10) 씬 회전 & 렌더 */
      scene.rotation.y += 0.0006;
      scene.rotation.x += 0.0003;
      renderer.render(scene, camera);
    };

    const disposeSpr = (s: THREE.Sprite) => {
      (s.material as THREE.Material).dispose();
    };

    loop();

    return () => cancelAnimationFrame(raf);
  }, [ctx, meshes, pointer, pointerSpeed]);
}
