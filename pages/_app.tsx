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
import BackgroundMusic from '@/components/BackgroundMusic';

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
    
    {/* 메인 콘텐츠 영역 - Footer 공간 확보 */}
    <div className="pt-16 pb-20"> {/* pb-20으로 Footer 공간 확보 */}
      <AnimatePresence mode="wait">
        <motion.main
          key={router.pathname}
          initial={{ 
            opacity: 0, 
            y: 20,
            scale: 0.95,
            filter: 'blur(10px)'
          }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: 1,
            filter: 'blur(0px)'
          }}
          exit={{ 
            opacity: 0, 
            y: -20,
            scale: 1.05,
            filter: 'blur(5px)'
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.22, 1, 0.36, 1], // cubic-bezier for smooth easing
            opacity: { duration: 0.4 },
            filter: { duration: 0.3 }
          }}
          className="min-h-screen"
        >
          <Component {...pageProps} />
        </motion.main>
      </AnimatePresence>
    </div>
    
    {/* 고정된 Footer - 화면 하단에 고정 */}
    <Footer className="fixed bottom-0 left-0 right-0 z-20"/>
    
    {/* 배경음악 컨트롤 */}
    <BackgroundMusic />
    </>
  );
}
