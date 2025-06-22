import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';

import {
  starfieldControls,
  overlayControls,
  /* starfieldBackground 삭제: Hover 때는 더 이상 사용 X */
  starfieldBackground,
} from './StarfieldCanvas';
import { UI } from '@/lib/uiConstants';

/* ─────────────────────────────────────────
   HEX → rgba() 변환
   ───────────────────────────────────────── */
const rgba = (hex: string, a: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

/* ─────────────────────────────────────────
   GlassPane
   ───────────────────────────────────────── */
type Label = 'About' | 'Product' | 'Contact';

interface Props {
  label: Label;
  route: string;
  index: number;
}

export default function GlassPane({ label, route }: Props) {
  const router   = useRouter();
  const controls = useAnimation();
  const [hovered, setHovered] = useState(false);

  /* 테마 색상 */
  const themeHex =
    label === 'About'
      ? UI.THEME.about
      : label === 'Product'
        ? UI.THEME.product
        : UI.THEME.contact;

  /* 유리창 배경색 */
  const bgColor = hovered
    ? rgba(themeHex, 0.25)                             // Hover 시 희미한 테마색
    : `rgba(255,255,255,var(--glass-bg-o))`;           // 기본 흰 유리

  /* 클릭 → 워프 확대 + 완전 틴트 후 라우팅 */
  const handleClick = useCallback(async () => {
    await Promise.all([
      starfieldControls.current?.start({
        scale: UI.WORMHOLE.zoomClick,
        transition: { duration: 0.8, ease: 'easeIn' },
      }),
      overlayControls.current?.start({
        backgroundColor: rgba(themeHex, 1),             // 100 % 틴트
        transition: { duration: 0.8, ease: 'easeIn' },
      }),
      controls.start({ opacity: 0, transition: { duration: 0.4 } }),
    ]);

    /* 클릭 시에는 테마색 우주로 전환 유지 */
    starfieldBackground.set(themeHex);
    router.push(route);
  }, [controls, router, route, themeHex]);

  return (
    <motion.button
      className="glass-pane"
      style={{ backgroundColor: bgColor }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.03 }}
      onHoverStart={() => {
        setHovered(true);

        /* 랜덤 Zoom */
        const z = UI.WORMHOLE.zoomMin +
                  Math.random() * (UI.WORMHOLE.zoomMax - UI.WORMHOLE.zoomMin);
        starfieldControls.current?.start({ scale: z });

        /* 오버레이만 반투명 테마색으로 – clearColor는 건드리지 않음 */
        overlayControls.current?.start({
          backgroundColor: rgba(themeHex, UI.THEME.OVERLAY_ALPHA),
        });
        /* ★ starfieldBackground.set 제거 → 우주 clearColor 유지 */
      }}
      onHoverEnd={() => {
        setHovered(false);

        starfieldControls.current?.start({ scale: 1 });
        overlayControls.current?.start({ backgroundColor: 'transparent' });
        /* ★ clearColor 리셋도 제거 → Hover에서는 배경색 변화 없음 */
      }}
      onClick={handleClick}
      transition={{ type: 'spring', stiffness: 160, damping: 18 }}
      aria-label={label}
    >
      {label}
    </motion.button>
  );
}
