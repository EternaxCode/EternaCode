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

const Starfield = dynamic(
  () => import('@/components/StarfieldCanvas').then(m => m.default),
  { ssr:false }
);

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const themeByPath: Record<string,string|undefined> = {
    '/':        UI.THEME.default,
    '/about'  : UI.THEME.about,
    '/product': UI.THEME.product,
    '/contact': UI.THEME.contact,
  };

  useEffect(() => {
    const themeHex = themeByPath[router.pathname] ?? UI.THEME.default;
    const isHome   = router.pathname === '/';

    /* 카메라가 준비된 뒤에만 clearColor 적용 */
    if (cameraControls.current) {
      starfieldBackground.set(themeHex);
    } else {
      setTimeout(() => starfieldBackground.set(themeHex), 0);
    }

    /* 오버레이 컬러 */
    overlayControls.current?.set({ backgroundColor: rgba(themeHex, 0.9) });
    overlayControls.current?.start({
      backgroundColor: rgba(themeHex, UI.THEME.OVERLAY_ALPHA),
      transition:{ duration:0.6, ease:'easeInOut' },
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
        html,body{margin:0;padding:0;height:100%;overflow:hidden;background:#000}
      `}</style>

      <Starfield/>

      <AnimatePresence mode="wait">
        <motion.div key={router.pathname}
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
          transition={{ duration:0.35, ease:'easeOut' }}
          style={{ position:'fixed', inset:0, overflow:'hidden', zIndex:30 }}
        >
          <Component {...pageProps}/>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
