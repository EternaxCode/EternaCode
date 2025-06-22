import type { RefObject } from 'react';
import { useRef } from 'react';
import { useStarRenderer } from './useStarRenderer';
import { useStarMeshes } from './useStarMeshes';
import { usePointerTracker } from './usePointerTracker';
import { useStarfieldLoop } from './useStarfieldLoop';
import { cameraControls, springCameraFov } from '@/components/StarfieldCanvas';

export function useStarfield(): RefObject<HTMLDivElement | null> {
  /* 1) renderer + mountRef */
  const { ctx, mountRef } = useStarRenderer();

  if (ctx && ctx.camera && cameraControls.current !== ctx.camera) {
    cameraControls.current = ctx.camera;
    if ((springCameraFov as any)._pending) {
      const to = (springCameraFov as any)._pending;
      (springCameraFov as any)._pending = null;
      springCameraFov(to);
    }
  }

  /* 2) pointer tracker ─ 항상 호출 */
  const { pointer, speed } = usePointerTracker(ctx?.camera ?? null);

  /* 3) meshes ─ 한 번만 생성, ref 에 캐시 */
  const meshesRef = useRef<ReturnType<typeof useStarMeshes> | null>(null);
  if (ctx && !meshesRef.current) {
    meshesRef.current = useStarMeshes(ctx.scene);
  }

  /* 4) ★ useStarfieldLoop 역시 항상 호출 ★ */
  useStarfieldLoop(
    ctx ?? null,
    meshesRef.current,
    pointer.current,
    () => speed.current
  );

  return mountRef;
}
