import type { AppProps } from 'next/app';
import { UI } from '@/lib/uiConstants';
import '../styles/globals.css';
import '../styles/pane.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  const { GLASS } = UI;

  return (
    <>
      {/* CSS 변수 전역 주입 */}
      <style jsx global>{`
        :root {
            --glass-blur:        ${GLASS.blur}px;
            --glass-hover-blur:  ${GLASS.hoverBlur}px;   /* ⭐ */
            --glass-bright:      ${GLASS.brightness};
            --glass-bg-o:        ${GLASS.bgOpacity};
            --glass-bg-hover-o:  ${GLASS.hoverOpacity};
            --glass-border-o:    ${GLASS.borderAlpha};
        }
      `}</style>

      <Component {...pageProps} />
    </>
  );
}
