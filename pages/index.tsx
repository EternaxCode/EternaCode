// pages/index.tsx
import MenuPane from '@/components/MenuPane';
import Head from 'next/head';

/* Starfield 전역 컨트롤 (색 리셋 용) */

export default function Home() {
  return (
    <>
      <Head><title>EternaxCode</title></Head>

      <div className="viewport-grid">
        <MenuPane label="About" route="/about" icon="about" index={0} />
        <MenuPane label="Product" route="/product" index={1} />
        <MenuPane label="Contact" route="/contact" index={2} />
      </div>
    </>
  );
}
