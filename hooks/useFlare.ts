import { useEffect } from 'react';
import styles from '@/styles/NeoStarPanel.module.css';

/** 패널 테두리에 랜덤 flare 스팟 + 광륜 g 루프 */
export function useFlare(ref: React.RefObject<HTMLElement> | null | undefined) {
  /* ── 랜덤 flare 스팟 ── */
  useEffect(() => {
    if (!ref?.current) return;        // ←★ null·undefined 모두 무시
    const host = ref.current;

    const SPOT_CNT = 18;
    const flares: HTMLElement[] = [];

    /* 궤도 계산 & 적용 (호스트 크기 변할 때마다 호출) */
    const applyOrbit = () => {
      const W = host.clientWidth;
      const H = host.clientHeight;
      const RAD = 24;
      const path = (w: number, h: number, r: number) =>
        `M ${r},0 H ${w - r} Q ${w},0 ${w},${r} V ${h - r}
         Q ${w},${h} ${w - r},${h} H ${r} Q 0,${h} 0,${h - r}
         V ${r} Q 0,0 ${r},0 Z`.replace(/\s+/g, ' ');
      const orbit = path(W, H, RAD);
      flares.forEach(f => (f.style.offsetPath = `path('${orbit}')`));
    };

    /* 초기 스팟 생성 */
    for (let i = 0; i < SPOT_CNT; i++) {
      const s = document.createElement('span');
      s.className = styles.flare;
      flares.push(s);
      host.appendChild(s);

      s.style.offsetDistance = `${Math.random() * 100}%`;
      s.style.offsetRotate   = 'auto';
      const dur = 3 + Math.random() * 3;
      s.style.setProperty('--dur', `${dur}s`);
      s.style.animationDelay = `-${Math.random() * dur}s`;
    }
    applyOrbit();

    /* ResizeObserver로 궤도 재계산 */
    const ro = new ResizeObserver(applyOrbit);
    ro.observe(host);

    return () => {
      ro.disconnect();
      flares.forEach(f => f.remove());
    };
  }, []);

  /* ── 광륜 g 값 루프 ── */
  useEffect(() => {
    if (!ref?.current) return;        // ←★ null·undefined 모두 무시
    const host = ref.current;
    if (!host) return;
    const MIN = 0.95, MAX = 1.10;
    let g = 1, tgt = 1, wait = 0, prev = performance.now();

    const loop = (now: number) => {
      const dt = (now - prev) / 1000;
      prev = now;
      if (wait <= 0) {
        tgt = MIN + Math.random() * (MAX - MIN);
        wait = 2 + Math.random() * 2;
      } else wait -= dt;
      g += (tgt - g) * dt * 1.5;
      host.style.setProperty('--g', g.toFixed(3));
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    return () => { host.style.removeProperty('--g'); }
  }, []);
}
