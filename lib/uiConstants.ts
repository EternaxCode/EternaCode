/*───────────────────────────
  UI / Glass-Pane Tunables
───────────────────────────*/
export const UI = {
    /* Glass panes */
    GLASS: {
        blur: 0,
        hoverBlur: 4,
        brightness: 1.15,
        bgOpacity: 0.05,
        hoverOpacity: 0.08,
        borderAlpha: 0.10,
    },

    /* Wormhole (카메라 FOV 애니메이션) */
    WORMHOLE: {
        fovNear: 100,   // 홈(/)  – 살짝 넓게
        fovFar: 40,   // 페이지 – 충분히 축소
        fovMin: 80,
        fovMax: 100,
        duration: 0.8
    },


    /* Pop sprite */
    POP: { size: 36, decay: 0.92 },

    /* Theme colors */
    THEME: {
        default: '#000000',
        about: '#005b6f',
        product: '#2a0057',
        contact: '#003c69',
        OVERLAY_ALPHA: 0.55,
    },
} as const;
