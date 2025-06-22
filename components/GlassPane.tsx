import { PropsWithChildren, useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/router';
import { UI } from '@/lib/uiConstants';
import { rgba } from '@/lib/colorUtils';
import {
  springCameraFov,
  overlayControls,
  starfieldBackground,
} from './StarfieldCanvas';

export type Label = 'About' | 'Product' | 'Contact';

interface Props { label: Label; route: string; index: number; }

export default function GlassPane(
  { label, route, children }: PropsWithChildren<Props>
) {
  const router = useRouter();
  const controls = useAnimation();
  const [hovered, setHovered] = useState(false);

  const themeHex =
    label === 'About' ? UI.THEME.about :
      label === 'Product' ? UI.THEME.product :
        UI.THEME.contact;

  const bgColor = hovered
    ? rgba(themeHex, 0.25)
    : `rgba(255,255,255,var(--glass-bg-o))`;

  /* 클릭 → 페이지 전환 */
  const handleClick = useCallback(async () => {

    /* 1) 카메라 줌-아웃 (FOV far) */
    springCameraFov(UI.WORMHOLE.fovFar);

    /* 2) 컬러 오버레이 + 버튼 페이드 */
    await Promise.all([
      overlayControls.current?.set({ backgroundColor: rgba(themeHex, 0.9) }),
      overlayControls.current?.start({
        backgroundColor: rgba(themeHex, UI.THEME.OVERLAY_ALPHA),
        transition: { duration: 0.6, ease: 'easeInOut' },
      }),
      controls.start({ opacity: 0, filter: 'blur(5px)', transition: { duration: 0.4 } }),
    ]);

    /* 3) 배경색 확정 후 라우팅 */
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
        springCameraFov(UI.WORMHOLE.fovMin +
          Math.random() * (UI.WORMHOLE.fovMax - UI.WORMHOLE.fovMin));
        overlayControls.current?.set({
          backgroundColor: rgba(themeHex, UI.THEME.OVERLAY_ALPHA)
        });
      }}
      onHoverEnd={() => {
        setHovered(false);
        springCameraFov(UI.WORMHOLE.fovNear);
        overlayControls.current?.set({ backgroundColor: 'transparent' });
      }}
      onClick={handleClick}
      transition={{ ease: "easeInOut", duration: UI.WORMHOLE.duration }}
    >
      {children ?? label}
    </motion.button>
  );
}
