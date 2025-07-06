'use client';

interface FooterProps { className?: string }

export default function Footer({ className = '' }: FooterProps) {
  return (
    <footer
      className={`
        flex items-center justify-center
        flex-none              /* ← 고정 높이, 늘어나지 않음 */
        w-full py-6
        text-sm tracking-wide text-[var(--text-sub)]
        backdrop-blur-sm bg-white/5/80   /* 살짝 투명 */
        border-t border-white/10
        ${className}
      `}
    >
      © 2025 EternaxCode Inc. All&nbsp;rights&nbsp;reserved.
    </footer>
  );
}
