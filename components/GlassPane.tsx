import { PropsWithChildren, useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/router';
import { UI } from '@/lib/uiConstants';
import {
  starfieldControls,
  overlayControls,
  starfieldBackground,
} from './StarfieldCanvas';

/* ───── HEX → rgba ───── */
const rgba = (hex: string, a: number) =>
  `rgba(${parseInt(hex.slice(1, 3), 16)},
        ${parseInt(hex.slice(3, 5), 16)},
        ${parseInt(hex.slice(5, 7), 16)},${a})`;

type Label = 'About' | 'Product' | 'Contact';

interface Props {
  label : Label;
  route : string;
  index : number;
}

/* children 가능하도록 PropsWithChildren */
export default function GlassPane(
  { label, route, children }: PropsWithChildren<Props>
) {
  const router   = useRouter();
  const controls = useAnimation();
  const [hovered, setHovered] = useState(false);

  const themeHex =
    label === 'About'
      ? UI.THEME.about
      : label === 'Product'
        ? UI.THEME.product
        : UI.THEME.contact;

  const bgColor = hovered
    ? rgba(themeHex, 0.25)
    : `rgba(255,255,255,var(--glass-bg-o))`;

  const handleClick = useCallback(async () => {
    await Promise.all([
      starfieldControls.current?.start({
        scale: UI.WORMHOLE.zoomClick,
        transition: { duration: 0.8, ease: 'easeIn' },
      }),
      overlayControls.current?.start({
        backgroundColor: rgba(themeHex, 1),
        transition: { duration: 0.8, ease: 'easeIn' },
      }),
      controls.start({ opacity: 0, transition: { duration: 0.4 } }),
    ]);
    starfieldBackground.set(themeHex);
    router.push(route);
  }, [controls, router, route, themeHex]);

  return (
    <motion.button
      className="glass-pane"
      style={{ backgroundColor: bgColor }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.03 }}
      onHoverStart={() => {
        setHovered(true);

        const z = UI.WORMHOLE.zoomMin +
                  Math.random() * (UI.WORMHOLE.zoomMax - UI.WORMHOLE.zoomMin);
        starfieldControls.current?.start({ scale: z });

        overlayControls.current?.start({
          backgroundColor: rgba(themeHex, UI.THEME.OVERLAY_ALPHA),
        });
      }}
      onHoverEnd={() => {
        setHovered(false);
        starfieldControls.current?.start({ scale: 1 });
        overlayControls.current?.start({ backgroundColor: 'transparent' });
      }}
      onClick={handleClick}
      transition={{ type: 'spring', stiffness: 160, damping: 18 }}
    >
      {/* 자식이 있으면 children, 없으면 label 텍스트 */}
      {children ?? label}
    </motion.button>
  );
}
