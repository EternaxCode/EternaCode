import * as THREE from 'three';
import { C } from './constants';

/*──────────────── 별(Points) ───────────────*/
export function createStarBuffers() {
  const count      = C.STAR.count;
  const positions  = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const origins    = new Float32Array(count * 3);
  const colors     = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const x = THREE.MathUtils.randFloatSpread(C.STAR.range);
    const y = THREE.MathUtils.randFloatSpread(C.STAR.range);
    const z = THREE.MathUtils.randFloatSpread(C.STAR.range);
    positions.set([x, y, z], i * 3);
    origins.set([x, y, z], i * 3);

    /* 간단 색 팔레트 */
    const palette = ['#ffcc6f','#ffd4a1','#fff4c1','#f8fdff','#cad8ff'];
    const clr = new THREE.Color(palette[Math.floor(Math.random() * palette.length)]);
    colors.set(clr.toArray(), i * 3);
  }
  return { positions, velocities, origins, colors };
}

export function buildStars(pos: Float32Array, col: Float32Array) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));

  const tex = (() => {
    const s = 64, c = document.createElement('canvas');
    c.width = c.height = s;
    const g = c.getContext('2d')!;
    const grd = g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
    grd.addColorStop(0,'#ffffff'); grd.addColorStop(1,'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0,0,s,s);
    return new THREE.CanvasTexture(c);
  })();

  const mat = new THREE.PointsMaterial({
    map: tex,
    size: C.STAR.baseSize,
    transparent: true,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return { mesh: new THREE.Points(geo, mat), geo, mat };
}

/*──────────────── 연결선(Line) ─────────────*/
export interface LinesBuilt {
  mesh:   THREE.LineSegments;
  geo:    THREE.BufferGeometry;
  mat:    THREE.LineBasicMaterial;
  pairs:  Uint16Array;
  colors: Float32Array;
}

export function buildLines(pos: Float32Array, col: Float32Array): LinesBuilt {
  const pairs: number[] = [];
  const count = C.STAR.count;

  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    for (let j = i + 1; j < count; j++) {
      const jx = j * 3;
      const dx = pos[ix] - pos[jx],
            dy = pos[ix+1] - pos[jx+1],
            dz = pos[ix+2] - pos[jx+2];
      if (Math.hypot(dx, dy, dz) < C.LINE.maxConnectDist) pairs.push(i, j);
    }
  }

  const linePos  = new Float32Array(pairs.length * 3);
  const lineCol  = new Float32Array(pairs.length * 3);
  const geo      = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(linePos, 3)
                                 .setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('color',    new THREE.BufferAttribute(lineCol, 3)
                                 .setUsage(THREE.DynamicDrawUsage));

  for (let k = 0; k < pairs.length; k += 2) {
    const ai = pairs[k]   * 3,
          bi = pairs[k+1] * 3,
          dst= k * 3;

    linePos.set([pos[ai], pos[ai+1], pos[ai+2],
                 pos[bi], pos[bi+1], pos[bi+2]], dst);

    lineCol.set([col[ai], col[ai+1], col[ai+2],
                 col[bi], col[bi+1], col[bi+2]], dst);
  }

  const mat = new THREE.LineBasicMaterial({
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    linewidth: 1,
    opacity: C.LINE.opacity
  });

  return { mesh: new THREE.LineSegments(geo, mat), geo, mat,
           pairs: new Uint16Array(pairs), colors: lineCol };
}

/*──────────────── Pulse 본체/꼬리 ───────────*/
export function buildPulsePoints(max: number) {
  /* 버퍼 */
  const pos = new Float32Array(max * 3);
  const col = new Float32Array(max * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)
                                 .setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3)
                                 .setUsage(THREE.DynamicDrawUsage));

  /* ⭐ 둥근 글로우 텍스처 (한 번만 생성 후 재사용) */
  const pulseTex = (() => {
    if ((buildPulsePoints as any)._cache) return (buildPulsePoints as any)._cache;
    const s = 32;
    const cv = document.createElement('canvas');
    cv.width = cv.height = s;
    const g = cv.getContext('2d')!;
    const grd = g.createRadialGradient(s/2, s/2, 0, s/2, s/2, s/2);
    grd.addColorStop(0,   'rgba(255,255,255,1)');
    grd.addColorStop(0.5, 'rgba(255,255,255,0.6)');
    grd.addColorStop(1,   'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
    return (buildPulsePoints as any)._cache = new THREE.CanvasTexture(cv);
  })();

  /* 재질 */
  const mat = new THREE.PointsMaterial({
    map: pulseTex,          // ← 둥근 스프라이트
    size: 5,
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
  });

  return { mesh: new THREE.Points(geo, mat),
           geo,
           positions: pos,
           colors: col };
}

export function buildTailPoints(max: number) {
  if (C.TAIL.len === 0) return null;
  const pos = new Float32Array(max * 3);
  const col = new Float32Array(max * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)
                                 .setUsage(THREE.DynamicDrawUsage));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3)
                                 .setUsage(THREE.DynamicDrawUsage));
  const mat = new THREE.PointsMaterial({
    size: C.TAIL.pointSize,
    transparent: true,
    opacity: C.TAIL.opacity,
    vertexColors: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return { mesh: new THREE.Points(geo, mat), geo, positions: pos, colors: col };
}
