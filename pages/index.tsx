import { useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import GlassPane from '@/components/GlassPane';

/* Starfield 캔버스 (클라이언트) */
const Starfield = dynamic(
  () => import('@/components/StarfieldCanvas').then(m => m.default),
  { ssr: false }
);

/* ★ Starfield 컨트롤 가져오기 */
import {
  overlayControls,
  starfieldBackground,
} from '@/components/StarfieldCanvas';

export default function Home() {
  /* 첫 마운트 때 검정 우주로 리셋 */
  useEffect(() => {
    overlayControls.current?.set({ backgroundColor: 'transparent' });
    starfieldBackground.reset();
  }, []);

  return (
    <>
      <Head><title>EternaxCode</title></Head>

      <Starfield />

      <div className="viewport-grid">
        <GlassPane label="About"    route="/"    index={0} />
        <GlassPane label="Product"  route="/"  index={1} />
        <GlassPane label="Contact"  route="/"  index={2} />
      </div>
    </>
  );
}
