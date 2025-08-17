import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { UI } from '@/lib/uiConstants';
import { rgba } from '@/lib/colorUtils';
import {
  springCameraFov,
  overlayControls,
  starfieldBackground,
  cameraControls
} from '@/components/StarfieldCanvas';

import '@/styles/globals.css';
import '@/styles/icon.css';
import '@/styles/glassPane.css';
import Head from 'next/head';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Starfield = dynamic(
  () => import('@/components/StarfieldCanvas').then(m => m.default),
  { ssr: false }
);

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const themeByPath: Record<string, string | undefined> = {
    '/': UI.THEME.default,
    '/about': UI.THEME.about,
    '/product': UI.THEME.product,
    '/contact': UI.THEME.contact,
  };

  useEffect(() => {
    const themeHex = themeByPath[router.pathname] ?? UI.THEME.default;
    const isHome = router.pathname === '/';

    /* 카메라가 준비된 뒤에만 clearColor 적용 */
    if (cameraControls.current) {
      starfieldBackground.set(themeHex, 600)
    } else {
      setTimeout(() => starfieldBackground.set(themeHex, 600), 0);
    }

    /* 오버레이 컬러 - 우주 테마 느낌 유지하되 텍스트 가독성 확보 */
    const overlayAlpha = isHome ? 0.0 : 0.12; // 홈은 완전 투명, 다른 페이지는 약간의 테마 색상
    overlayControls.current?.set({ backgroundColor: rgba(themeHex, overlayAlpha + 0.05) });
    overlayControls.current?.start({
      backgroundColor: rgba(themeHex, overlayAlpha),
      transition: { duration: 0.6, ease: 'easeInOut' },
    });

    /* FOV 애니메이션 */
    springCameraFov(isHome ? UI.WORMHOLE.fovNear : UI.WORMHOLE.fovFar);
  }, [router.pathname]);

  const { GLASS } = UI;

  return (
    <>
      {/* GlassPane CSS 변수 */}
      <style jsx global>{`
        :root{
          --glass-blur:${GLASS.blur}px;
          --glass-hover-blur:${GLASS.hoverBlur}px;
          --glass-bright:${GLASS.brightness};
          --glass-bg-o:${GLASS.bgOpacity};
          --glass-bg-hover-o:${GLASS.hoverOpacity};
          --glass-border-o:${GLASS.borderAlpha};
        }
      `}</style>

    <div className="fixed inset-0 z-0 pointer-events-none">
     <Starfield />
    </div>
    <Navigation />
    <div className="flex flex-col min-h-screen pt-16">
      <AnimatePresence mode="wait">
        <motion.main               /* main 요소 사용 */
          key={router.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex-1"
        >
          <Component {...pageProps} />
        </motion.main>
      </AnimatePresence>
      <Footer className="mt-auto"/>
    </div>
    </>
  );
}
