import Head from 'next/head';
import dynamic from 'next/dynamic';
import GlassPane from '@/components/GlassPane';
import { useState } from 'react';

const Starfield = dynamic(
  () => import('@/components/StarfieldCanvas').then((m) => m.default),
  { ssr: false }
);

export default function Home() {
  /* ⭐ 현재 Hover 중인 메뉴 라벨 (About | Product | Contact | null) */
  const [active, setActive] = useState<null | 'About' | 'Product' | 'Contact'>(null);

  return (
    <>
      <Head><title>EternaxCode</title></Head>

      <Starfield />

      <div className="viewport-grid">
        <GlassPane label="About"    route="/#"    active={active} setActive={setActive} />
        <GlassPane label="Product"  route="/#"  active={active} setActive={setActive} />
        <GlassPane label="Contact"  route="/#"  active={active} setActive={setActive} />
      </div>
    </>
  );
}
