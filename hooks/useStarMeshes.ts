import * as THREE from 'three';
import { C } from '@/lib/starfield/constants';
import {
  createStarBuffers, buildStars, buildLines,
  buildPulsePoints, buildTailPoints, LinesBuilt,
} from '@/lib/starfield/builders';
import { TAIL_LEN } from '@/lib/starfield/pulses';

export interface MeshBundle {
  starMesh  : THREE.Points;
  lineMesh  : THREE.LineSegments;
  pulseMesh : THREE.Points;
  /* ★ tail 은 Points | LineSegments 양쪽 허용 */
   tail?     : {   /* tail 정보를 완전하게 */
    mesh : THREE.Points;
    geo  : THREE.BufferGeometry;
    positions: Float32Array;
    colors   : Float32Array;
  };
  clean     : () => void;
  starBuf   : ReturnType<typeof createStarBuffers>;
  lineInfo  : LinesBuilt;
  pulseInfo : ReturnType<typeof buildPulsePoints>;
}

const disposeMat = (m: THREE.Material | THREE.Material[]) =>
  Array.isArray(m) ? m.forEach(mm => mm.dispose()) : m.dispose();

export function useStarMeshes(scene: THREE.Scene | null): MeshBundle | null {
  if (!scene) return null;   
  /* ─ 별 버퍼 ─ */
  const starBuf     = createStarBuffers();
  const starBaseCol = starBuf.colors;
  const starDispCol = new Float32Array(starBaseCol);

  const { mesh: starMesh, geo: starGeo, mat: starMat } =
    buildStars(starBuf.positions, starDispCol);
  starMesh.name = 'STAR_MESH';

  const {
    mesh : lineMesh,
    geo  : lineGeo,
    mat  : lineMat,
    pairs,
    colors: lineColors,
  } = buildLines(starBuf.positions, starBaseCol);
  lineMesh.name = 'LINE_MESH';

  const pulseInfo = buildPulsePoints(C.PULSE.maxCount);

  /* ─ Tail: Points 로 생성 ─ */

  const tailRaw = buildTailPoints(C.PULSE.maxCount * TAIL_LEN);
  const tailInfo = tailRaw
    ? { mesh: tailRaw.mesh, geo: tailRaw.geo, positions: tailRaw.positions, colors: tailRaw.colors }
    : undefined;

  scene.add(starMesh, lineMesh, pulseInfo.mesh);
  if (tailInfo) scene.add(tailInfo.mesh);

  /* ─ 정리 ─ */
  const clean = () => {
    starGeo.dispose(); disposeMat(starMat);
    lineGeo.dispose(); disposeMat(lineMat);
    pulseInfo.geo.dispose(); disposeMat(pulseInfo.mesh.material);
    if (tailInfo) {
      tailInfo.geo.dispose();
      disposeMat(tailInfo.mesh.material);
    }
  };

  return {
    starMesh,
    lineMesh,
    pulseMesh: pulseInfo.mesh,
    tail: tailInfo,
    clean,
    starBuf,
    lineInfo: { mesh: lineMesh, geo: lineGeo, mat: lineMat, pairs, colors: lineColors },
    pulseInfo,
  };
}
