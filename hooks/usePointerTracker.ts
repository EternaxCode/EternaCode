import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/** 카메라가 준비되지 않았을 때(null)도 오류 없이 동작 */
export function usePointerTracker(camera: THREE.Camera | null) {
  const pointer = useRef(new THREE.Vector3());
  const speed   = useRef(0);

  useEffect(() => {
    if (!camera) return;              // 카메라 null이면 효과 건너뜀

    const ray   = new THREE.Raycaster();
    const ndc   = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const prev  = new THREE.Vector3();

    const move = (e: PointerEvent) => {
      ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      ray.ray.intersectPlane(plane, pointer.current);
      speed.current = pointer.current.distanceTo(prev);
      prev.copy(pointer.current);
    };

    addEventListener('pointermove', move);
    return () => removeEventListener('pointermove', move);
  }, [camera]);

  return { pointer, speed };
}
