import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import * as THREE from 'three';
import { useStarfield } from '@/hooks/useStarfield';
import { UI } from '@/lib/uiConstants';

type MotionCtrl = ReturnType<typeof useAnimation>;

export const starfieldControls: { current: MotionCtrl | null } = { current: null };
export const overlayControls  : { current: MotionCtrl | null } = { current: null };
export const starfieldBackground = {
  set  : (hex: string) => {},
  reset: ()            => {},
};

export default function StarfieldCanvas() {
  const mountRef = useStarfield();              // 훅이 ref 반환

  const sfCtrl = useAnimation();                // 웜홀(스케일)
  const ovCtrl = useAnimation();                // 컬러 오버레이

  useEffect(() => {
    starfieldControls.current = sfCtrl;
    overlayControls.current   = ovCtrl;

    /* renderer 참조 꺼내기 */
    const canvas = mountRef.current?.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const renderer = (canvas as any).__threeRenderer as THREE.WebGLRenderer | undefined;
    if (!renderer) return;

    /* 배경색 함수 등록 */
    starfieldBackground.set   = (hex: string) => renderer.setClearColor(hex, 1);
    starfieldBackground.reset = ()             => renderer.setClearColor('#000', 1);

    sfCtrl.set({ scale: 1 });
    ovCtrl.set({ backgroundColor: 'transparent' });
    starfieldBackground.reset();
  }, [mountRef, sfCtrl, ovCtrl]);

  return (
    <motion.div ref={mountRef} className="fixed inset-0 -z-10">
      {/* 컬러 오버레이 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: 'screen', zIndex: -5 }}
        animate={ovCtrl}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      {/* 웜홀 스케일 */}
      <motion.div
        className="absolute inset-0"
        animate={sfCtrl}
        transition={{ duration: UI.WORMHOLE.duration, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}
