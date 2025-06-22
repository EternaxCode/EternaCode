// lib/starfield/physics.ts
import { PHYSICS, DYNAMIC } from './parameters';

export interface StarfieldState {
  positions:  Float32Array;
  velocities: Float32Array;
  origins:    Float32Array;
}

/**
 * 매 프레임 별 위치·속도 갱신
 * @param state          버퍼 모음
 * @param pointer        [x,y,z] 3D 좌표
 * @param pointerSpeed   이전 프레임 대비 이동거리(세계 좌표계)
 */
export function updateStarfield(
  state: StarfieldState,
  pointer: [number, number, number],
  pointerSpeed: number,
) {
  const { positions, velocities, origins } = state;
  const { DAMPING, ATTRACT_STRENGTH, REPULSE_RADIUS, REPULSE_POWER } = PHYSICS;
  const { SPEED_RADIUS_FACTOR, SPEED_POWER_FACTOR, MAX_RADIUS, MAX_POWER } = DYNAMIC;

  /* 속도 기반 동적 반경·힘 */
  const dynRadius = Math.min(
    REPULSE_RADIUS + pointerSpeed * SPEED_RADIUS_FACTOR,
    MAX_RADIUS,
  );
  const dynPower  = Math.min(
    REPULSE_POWER  + pointerSpeed * SPEED_POWER_FACTOR,
    MAX_POWER,
  );
  const dynRadiusSq = dynRadius * dynRadius;

  const [px, py, pz] = pointer;

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];

    /* ① 원래 자리로 복원 */
    velocities[i]     += (origins[i]     - x) * ATTRACT_STRENGTH;
    velocities[i + 1] += (origins[i + 1] - y) * ATTRACT_STRENGTH;
    velocities[i + 2] += (origins[i + 2] - z) * ATTRACT_STRENGTH;

    /* ② 포인터 반발 (속도에 비례해 범위·세기 가변) */
    const dx = x - px;
    const dy = y - py;
    const dz = z - pz;
    const distSq = dx*dx + dy*dy + dz*dz;

    if (distSq < dynRadiusSq && distSq > 0.0001) {
      const force = dynPower / distSq;  // 1/r²
      const dist  = Math.sqrt(distSq);
      velocities[i]     += (dx / dist) * force;
      velocities[i + 1] += (dy / dist) * force;
      velocities[i + 2] += (dz / dist) * force;
    }

    /* ③ 감쇠 & 위치 갱신 */
    velocities[i]     *= DAMPING;
    velocities[i + 1] *= DAMPING;
    velocities[i + 2] *= DAMPING;

    positions[i]     += velocities[i];
    positions[i + 1] += velocities[i + 1];
    positions[i + 2] += velocities[i + 2];
  }
}
