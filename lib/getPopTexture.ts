import * as THREE from 'three';

/** 클라이언트에서만 1회 생성 후 캐시 */
export function getPopTexture(): THREE.Texture | undefined {
  if (typeof window === 'undefined') return undefined;

  if ((getPopTexture as any)._cache) return (getPopTexture as any)._cache;

  const s = 64;
  const cv = document.createElement('canvas');
  cv.width = cv.height = s;
  const g = cv.getContext('2d')!;
  const grd = g.createRadialGradient(s/2, s/2, 0, s/2, s/2, s/2);
  grd.addColorStop(0,   'rgba(255,255,255,1)');
  grd.addColorStop(0.4, 'rgba(255,255,255,0.7)');
  grd.addColorStop(1,   'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, s, s);

  return ((getPopTexture as any)._cache = new THREE.CanvasTexture(cv));
}
