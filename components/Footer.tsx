'use client';

import { motion } from 'framer-motion';

interface FooterProps { className?: string }

export default function Footer({ className = '' }: FooterProps) {
  return (
    <footer
      className={`
        flex items-center justify-center
        flex-none              /* ← 고정 높이, 늘어나지 않음 */
        w-full py-6
        text-sm tracking-wide text-[var(--text-main)]
        backdrop-blur-sm bg-white/5/80   /* 살짝 투명 */
        border-t border-white/10
        ${className}
      `}
    >
      {/* Footer 내부 텍스트만 애니메이션 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 0.8, 
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        © 2025 EternaxCode Inc. All&nbsp;rights&nbsp;reserved.
      </motion.div>
    </footer>
  );
}
