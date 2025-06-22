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
import MenuPane from '@/components/MenuPane';

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
        <MenuPane label="About"   route="/about"   icon="about"   index={0} />
        <MenuPane label="Product" route="/product" index={1} />
        <MenuPane label="Contact" route="/contact" index={2} />
      </div>
    </>
  );
}
