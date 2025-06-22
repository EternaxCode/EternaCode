import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { UI } from '@/lib/uiConstants';
import '../styles/globals.css';
import '../styles/pane.css';
import '../styles/icon.css';

const Starfield = dynamic(
  () => import('@/components/StarfieldCanvas').then(m => m.default),
  { ssr: false }
);

export default function MyApp({ Component, pageProps, router }: AppProps) {
  const { GLASS } = UI;

  return (
    <>
      {/* CSS 변수 : 유리창 설정 */}
      <style jsx global>{`
        :root {
          --glass-blur:        ${GLASS.blur}px;
          --glass-hover-blur:  ${GLASS.hoverBlur}px;
          --glass-bright:      ${GLASS.brightness};
          --glass-bg-o:        ${GLASS.bgOpacity};
          --glass-bg-hover-o:  ${GLASS.hoverOpacity};
          --glass-border-o:    ${GLASS.borderAlpha};
        }

        /* 전역 리셋 + 스크롤 제거 */
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
          background: #000;
        }
      `}</style>

      {/* 페이지 컴포넌트 전환 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={router.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            overflow: 'hidden',
            zIndex: 30,      // Starfield(-10)·오버레이(-5) 위
          }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </>
  );
}
