import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface ThreeCtx {
  scene   : THREE.Scene;
  camera  : THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}

/** Three 기본 객체를 만들고 ctx + mountRef 를 반환 */
export function useStarRenderer(): {
  ctx: ThreeCtx | null;
  mountRef: React.RefObject<HTMLDivElement | null>;
} {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [ctx, setCtx] = useState<ThreeCtx | null>(null);   // ★ state

  useEffect(() => {
    if (!mountRef.current) return;

    /* ─ Three 객체 ─ */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 1, 2000);
    camera.position.z = 450;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor('#000000', 0);

    mountRef.current.appendChild(renderer.domElement);
    Object.assign(renderer.domElement, {
      __threeRenderer: renderer,
      __threeScene: scene,
    });

    /* ctx 준비 완료 → state 업데이트 → 부모 컴포넌트 re-render */
    setCtx({ scene, camera, renderer });

    const resize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };
    addEventListener('resize', resize);

    return () => {
      removeEventListener('resize', resize);
      renderer.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return { ctx, mountRef };
}
