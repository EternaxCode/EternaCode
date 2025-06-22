import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import {
  starfieldControls,
  overlayControls,
  starfieldBackground,
} from './StarfieldCanvas';
import { UI } from '@/lib/uiConstants';

/* 메뉴 라벨 타입 */
type Label = 'About' | 'Product' | 'Contact';
type Props = {
  label: Label;
  route: string;
  active: Label | null;
  setActive: (l: Label | null) => void;
};

/* HEX → RGBA 변환 */
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

export default function GlassPane({ label, route, active, setActive }: Props) {
  const router   = useRouter();
  const controls = useAnimation();

  /* 테마 HEX 선택 */
  const themeHex =
    label === 'About'   ? UI.THEME.about   :
    label === 'Product' ? UI.THEME.product : UI.THEME.contact;

  /* 유리창 배경색 계산 */
  const paneBg =
    active === label
      ? hexToRgba(themeHex, 0.25)              // Hover 중 : 진하게
      : active === null
        ? hexToRgba('#ffffff', UI.GLASS.bgOpacity) // 아무도 Hover 아님
        : hexToRgba(themeHex, 0.05);            // 비활성 : 희미하게

  /* 클릭 시 페이지 전환 */
  const handleClick = useCallback(async () => {
    await controls.start({
      scale: 1.15,
      opacity: 0,
      transition: { duration: 0.5, ease: 'easeInOut' },
    });
    router.push(route);
  }, [controls, router, route]);

  return (
    <motion.button
      className="glass-pane"
      style={{ backgroundColor: paneBg }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.03 }}
      onHoverStart={() => {
        setActive(label);

        /* 랜덤 줌 */
        const z =
          UI.WORMHOLE.zoomMin +
          Math.random() * (UI.WORMHOLE.zoomMax - UI.WORMHOLE.zoomMin);
        starfieldControls.current?.start({ scale: z });

        /* 오버레이 색 & Three.js 배경 틴트 */
        overlayControls.current?.start({
          backgroundColor: hexToRgba(themeHex, UI.THEME.OVERLAY_ALPHA),
        });
        starfieldBackground.set(themeHex);
      }}
      onHoverEnd={() => {
        setActive(null);
        starfieldControls.current?.start({ scale: 1 });
        overlayControls.current?.start({ backgroundColor: 'transparent' });
        starfieldBackground.reset();
      }}
      onClick={handleClick}
      transition={{ type: 'spring', stiffness: 160, damping: 18 }}
      aria-label={label}
    >
      {label}
    </motion.button>
  );
}
