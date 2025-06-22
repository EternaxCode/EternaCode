import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useStarfield } from '@/hooks/useStarfield';
import * as THREE from 'three';
import { UI } from '@/lib/uiConstants';

/* 외부에서 사용할 컨트롤 · 함수들 */
type MotionCtrl = ReturnType<typeof useAnimation>;
export const starfieldControls: { current: MotionCtrl | null } = { current: null };
export const overlayControls : { current: MotionCtrl | null } = { current: null };
export const starfieldBackground = {
  set  : (hex: string) => {},   // 배경색을 테마색으로
  reset: ()            => {},   // 검정으로
};

export default function StarfieldCanvas() {
  /* useStarfield 훅이 Three 캔버스를 붙일 ref 를 반환 */
  const mountRef = useStarfield();

  /* 애니메이션 컨트롤 */
  const sfCtrl = useAnimation();   // 웜홀(스케일)
  const ovCtrl = useAnimation();   // 컬러 오버레이

  useEffect(() => {
    /* 컨트롤을 외부로 노출 */
    starfieldControls.current = sfCtrl;
    overlayControls.current   = ovCtrl;
    sfCtrl.set({ scale: 1 });
    ovCtrl.set({ backgroundColor: 'transparent' });

    /* ── Three.js renderer 가져오기 ── */
    const canvas = mountRef.current?.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) return;

    const renderer = (canvas as any).__threeRenderer as THREE.WebGLRenderer | undefined;
    if (!renderer) return;

    /* 배경색 변경 함수 구현 */
    starfieldBackground.set   = (hex: string) => renderer.setClearColor(hex, 1);
    starfieldBackground.reset = ()             => renderer.setClearColor('#000000', 1);

    /* 초기 검정 우주 */
    starfieldBackground.reset();
  }, [mountRef, sfCtrl, ovCtrl]);

  return (
    <motion.div
      ref={mountRef}
      className="fixed inset-0 -z-10"
      animate={sfCtrl}
      transition={{ duration: UI.WORMHOLE.duration, ease: 'easeInOut' }}
    >
      {/* 컬러 오버레이 레이어 (mix-blend-mode 로 부드럽게) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'screen', zIndex: -5 }}
        animate={ovCtrl}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
