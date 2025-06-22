// lib/starfield/parameters.ts
export const STAR_COUNT       = 600;
export const STAR_RANGE       = 800;
export const MAX_CONNECT_DIST = 120;

/*──────────────────────────────────────────────
  기본 물리 파라미터
──────────────────────────────────────────────*/
export const PHYSICS = {
  DAMPING:          0.92,
  ATTRACT_STRENGTH: 0.002,
  REPULSE_RADIUS:   140,
  REPULSE_POWER:    2500,
} as const;

/*──────────────────────────────────────────────
  포인터 속도 → 반경·힘 보정치
──────────────────────────────────────────────*/
export const DYNAMIC = {
  SPEED_RADIUS_FACTOR:  40,     // radius += speed * 40
  SPEED_POWER_FACTOR:   2000,   // power  += speed * 2000
  MAX_RADIUS:           500,    // 상한선 (폭주 방지)
  MAX_POWER:            15000,
} as const;


export const PULSE = {
  MAX_COUNT:      1200,   // 한 번에 살아있는 Pulse 수
  SPEED_BASE:     1.6,    // 기본 속도 (xyz 단위/frame)
  SPEED_VARIANCE: 0.8,    // 속도 무작위 편차
  SPAWN_CHANCE:   0.02,   // 프레임당 “발사” 확률
  STAR_BRIGHT_BOOST: 2,   // Pulse 충돌 시 별 밝기 증가치
  DECAY_RATE:     0.003,  // 별 밝기 자연 감쇠
} as const;
