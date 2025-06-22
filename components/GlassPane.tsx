import { PropsWithChildren, useCallback, useEffect } from 'react';
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
  const router   = useRouter();
  const ctrlSelf = useAnimation();

  /* 테마 색상 */
  const themeHex =
    label === 'About'   ? UI.THEME.about   :
    label === 'Product' ? UI.THEME.product :
                          UI.THEME.contact;

  /* RGBA 값(숫자 알파) — framer 애니메이트 가능 */
  const baseBG  = `rgba(255,255,255,${UI.GLASS.bgOpacity})`;   // 0.05
  const hoverBG = rgba(themeHex, 0.15);                        // 0.15
  const fadeBG  = rgba(themeHex, 0.03);                        // 0.03

  /* mount 직후 기본 배경 세팅 */
  useEffect(() => {
    ctrlSelf.set({ backgroundColor: baseBG });
  }, [baseBG, ctrlSelf]);

  /* 클릭 트랜지션 */
  const handleClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    /* 1) 다른 Pane 들도 즉시 페이드(0.3 s) */
    document.querySelectorAll<HTMLButtonElement>('.glass-pane').forEach(el=>{
      if (el !== e.currentTarget) {
        el.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: 300, easing: 'ease-out', fill: 'forwards' }
        );
      }
    });

    /* 2) 자신의 배경 희미화(0.25 s) */
    ctrlSelf.start({
      backgroundColor: fadeBG,
      transition:{ duration:0.25, ease:'easeOut' },
    });

    /* 3) 카메라 줌·배경색 페이드 (0.8 s) */
    springCameraFov(UI.WORMHOLE.fovFar);
    starfieldBackground.set(themeHex, UI.WORMHOLE.duration * 1000);

    /* 4) 컬러 오버레이 & 자신 완전 사라짐 */
    await Promise.all([
      overlayControls.current?.set({ backgroundColor: rgba(themeHex,0.9) }),
      overlayControls.current?.start({
        backgroundColor: rgba(themeHex, UI.THEME.OVERLAY_ALPHA),
        transition:{ duration:UI.WORMHOLE.duration, ease:'easeOut' },
      }),
      ctrlSelf.start({
        opacity:0,
        transition:{ delay:0.1, duration:0.35, ease:'easeOut' },
      }),
    ]);

    router.push(route);
  }, [ctrlSelf, router, route, themeHex, fadeBG]);

  return (
    <motion.button
      className="glass-pane"
      initial={{ opacity:1, backgroundColor: baseBG }}
      animate={ctrlSelf}          /* AnimationControls 단일 전달 */
      whileHover={{ scale:1.04 }}
      onHoverStart={()=>{
        springCameraFov(
          UI.WORMHOLE.fovMin +
          Math.random() * (UI.WORMHOLE.fovMax - UI.WORMHOLE.fovMin)
        );
        overlayControls.current?.set({
          backgroundColor: rgba(themeHex, UI.THEME.OVERLAY_ALPHA),
        });
        ctrlSelf.start({
          backgroundColor: hoverBG,
          transition:{ duration:0.15 },
        });
      }}
      onHoverEnd={()=>{
        springCameraFov(UI.WORMHOLE.fovNear);
        overlayControls.current?.set({ backgroundColor:'transparent' });
        ctrlSelf.start({
          backgroundColor: baseBG,
          transition:{ duration:0.2 },
        });
      }}
      onClick={handleClick}
      transition={{ ease:"easeOut", duration: 0.2 }}
    >
      {children ?? label}
    </motion.button>
  );
}
