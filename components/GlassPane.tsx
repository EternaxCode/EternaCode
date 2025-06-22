import { PropsWithChildren, useState, useCallback, useEffect } from 'react';
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
  const ctrlSelf = useAnimation();          // GlassPane 전용 컨트롤
  const [hovered, setHovered] = useState(false);

  const themeHex =
    label === 'About' ? UI.THEME.about :
      label === 'Product' ? UI.THEME.product :
        UI.THEME.contact;

  const baseBG = `rgba(255,255,255,var(--glass-bg-o))`;
  const hoverBG = rgba(themeHex, 0.15);

  /* ⚠️ mount 후 기본 상태 세팅 */
  useEffect(() => {
    ctrlSelf.set({ backgroundColor: baseBG });
  }, [baseBG, ctrlSelf]);

  /* 클릭 트랜지션 */
  const handleClick = useCallback(async (e: React.MouseEvent) => {
    /* 1) GlassPane 배경 희미화 */
    ctrlSelf.start({
      backgroundColor: rgba(themeHex, 0.03),
      transition: { duration: 0.25, ease: 'easeOut' },
    });

    document
      .querySelectorAll<HTMLButtonElement>('.glass-pane')
      .forEach(el => {
        if (el !== e.currentTarget) {            // 클릭된 자신은 제외
          el.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration: 300, easing: 'ease-out', fill: 'forwards' }
          );
        }
      });

    /* 2) 카메라 줌 + clearColor 페이드 */
    springCameraFov(UI.WORMHOLE.fovFar);
    starfieldBackground.set(themeHex, UI.WORMHOLE.duration * 1000);

    /* 3) 오버레이 & 버튼 페이드아웃 */
    await Promise.all([
      overlayControls.current?.set({ backgroundColor: rgba(themeHex, 0.9) }),
      overlayControls.current?.start({
        backgroundColor: rgba(themeHex, UI.THEME.OVERLAY_ALPHA),
        transition: { duration: UI.WORMHOLE.duration, ease: 'easeInOut' },
      }),
      ctrlSelf.start({
        opacity: 0,
        transition: { delay: 0.1, duration: 0.35, ease: 'easeOut' },
      }),
    ]);

    router.push(route);
  }, [ctrlSelf, router, route, themeHex]);

  return (
    <motion.button
      className="glass-pane"
      initial={{ opacity: 1, backgroundColor: baseBG }}
      animate={ctrlSelf}                 /* AnimationControls 한 가지만 전달 */
      whileHover={{ scale: 1.04 }}
      onHoverStart={() => {
        setHovered(true);
        springCameraFov(UI.WORMHOLE.fovMin +
          Math.random() * (UI.WORMHOLE.fovMax - UI.WORMHOLE.fovMin));
        overlayControls.current?.set({
          backgroundColor: rgba(themeHex, UI.THEME.OVERLAY_ALPHA)
        });
        ctrlSelf.start({
          backgroundColor: hoverBG,
          transition: { duration: 0.15 },
        });
      }}
      onHoverEnd={() => {
        setHovered(false);
        springCameraFov(UI.WORMHOLE.fovNear);
        overlayControls.current?.set({ backgroundColor: 'transparent' });
        ctrlSelf.start({
          backgroundColor: baseBG,
          transition: { duration: 0.2 },
        });
      }}
      onClick={handleClick}
      transition={{ type: 'spring', stiffness: 130, damping: 18 }}
    >
      {children ?? label}
    </motion.button>
  );
}
