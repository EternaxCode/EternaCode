/*───────────────────────────
  UI / Glass-Pane Tunables
───────────────────────────*/
export const UI = {
  /* Glass panes */
  GLASS: {
    blur         : 0,    // 기본 블러(px)
    hoverBlur    : 4,    // Hover 시 블러(px)
    brightness   : 1.15,  // 전체 밝기 보정
    bgOpacity    : 0.05,  // 기본 배경 투명도
    hoverOpacity : 0.08,  // Hover 배경 투명도
    borderAlpha  : 0.10,  // 칸 사이 경계선 투명도
  },

  /* Wormhole 효과 */
  WORMHOLE: {
    zoomMin    : 1.25,    // ⭐ 최소 확대 배율
    zoomMax    : 1.6,     // ⭐ 최대 확대 배율
    duration   : 0.8,     // 애니메이션 길이(s)
    zoomClick : 2.0,
  },

  /* Pop 스프라이트 */
  POP: {
    size   : 36,          // 처음 번쩍 크기(px)
    decay  : 0.92,        // 프레임당 scale·opacity 감쇠
  },

  THEME: {
    default : '#000000', // 기본(검정 우주)
    about   : '#00232c',
    product : '#2a0057',
    contact : '#003c69',
    OVERLAY_ALPHA: 0.55,   // ← 색상 섞는 불투명도 (0~1)

  },
} as const;
