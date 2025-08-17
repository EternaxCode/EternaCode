'use client';

import {
  PropsWithChildren,
  useCallback,
  useEffect,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  FocusEvent as ReactFocusEvent,
} from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/router';

import { UI }   from '@/lib/uiConstants';
import { rgba } from '@/lib/colorUtils';
import {
  springCameraFov,
  overlayControls,      // 클릭 전환 때 전체 오버레이용
  starfieldBackground,
} from './StarfieldCanvas';

export type Label = 'About' | 'Product' | 'Contact';
interface Props {
  label : Label;
  route : string;
  index : number;
}

/* 모든 입력 이벤트 타입 통합 */
type BtnEvt =
  | ReactMouseEvent<HTMLButtonElement>
  | ReactPointerEvent<HTMLButtonElement>
  | ReactFocusEvent<HTMLButtonElement>
  | MouseEvent | PointerEvent | TouchEvent | FocusEvent;

/* ─────────────────────────────────────────────── */
/*                GlassPane 컴포넌트               */
/* ─────────────────────────────────────────────── */
export default function GlassPane(
  { label, route, children }: PropsWithChildren<Props>
) {
  const router   = useRouter();
  const ctrlSelf = useAnimation();               // 버튼 자체 애니메이션

  /* ─── 테마 색상 • 배경 값 ─── */
  const themeHex =
    label === 'About'   ? UI.THEME.about   :
    label === 'Product' ? UI.THEME.product :
                          UI.THEME.contact;

  const baseBG  = `rgba(255,255,255,${UI.GLASS.bgOpacity})`; // 0.05
  const hoverBG = rgba(themeHex, 0.12);                     // 버튼 hover 색
  const fadeBG  = rgba(themeHex, 0.06);                     // 클릭 직후

  /* mount 직후 기본 배경 세팅 */
  useEffect(() => { ctrlSelf.set({ backgroundColor: baseBG }); }, [baseBG]);

  /* ─── Hover / Pointer / Focus 진입·이탈 ─── */
  const highlightPane = (entering: boolean) => {
    springCameraFov(
      entering
        ? UI.WORMHOLE.fovMin + Math.random() * (UI.WORMHOLE.fovMax - UI.WORMHOLE.fovMin)
        : UI.WORMHOLE.fovNear
    );
    ctrlSelf.start({
      backgroundColor: entering ? hoverBG : baseBG,
      transition: { duration: 0.18 },
    });
  };

  const onEnter = (e: BtnEvt) => highlightPane(true);
  const onLeave = (e: BtnEvt) => highlightPane(false);

  /* ─── Click 전환 애니메이션 ─── */
  const handleClick = useCallback(async () => {
    /* 1) 다른 패널 페이드 */
    document.querySelectorAll<HTMLButtonElement>('.glass-pane').forEach(el=>{
      if (el !== document.activeElement) {
        el.animate([{ opacity: 1 }, { opacity: 0 }],
          { duration: 300, easing: 'ease-out', fill: 'forwards' });
      }
    });

    /* 2) 자기 배경 희미화 */
    ctrlSelf.start({ backgroundColor: fadeBG, transition:{ duration: 0.25 } });

    /* 3) Starfield 줌 아웃 + clearColor */
    springCameraFov(UI.WORMHOLE.fovFar);
    starfieldBackground.set(themeHex, UI.WORMHOLE.duration * 1000);

    /* 4) 전체 컬러 오버레이 → 페이지 전환 (우주 이동 효과) */
    await overlayControls.current?.start({
      backgroundColor: rgba(themeHex, 0.35),
      transition:{ duration:UI.WORMHOLE.duration, ease:'easeOut' },
    });

    router.push(route);
  }, [ctrlSelf, router, route, themeHex, fadeBG]);

  /* ─── JSX ─── */
  return (
    <motion.button
      className="glass-pane select-none"
      initial={{ opacity: 1, backgroundColor: baseBG }}
      animate={ctrlSelf}
      whileHover={{ scale: 1.05 }}
      /* 마우스 */
      onHoverStart={onEnter}
      onHoverEnd  ={onLeave}
      /* 포인터(터치·펜) */
      onPointerDown={onEnter}
      onPointerUp  ={onLeave}
      onPointerCancel={onLeave}
      /* 키보드 접근성 */
      onFocus={onEnter}
      onBlur ={onLeave}
      /* Click */
      onClick={handleClick}
      transition={{ ease: 'easeOut', duration: 0.2 }}
    >
      {children ?? label}
    </motion.button>
  );
}
