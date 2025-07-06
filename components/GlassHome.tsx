'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';

/**
 * Glass-style floating home button
 * · fixed ⤿ top-left (mobile 12px / desktop 24px)
 * · glass blur + thin border + hover 밝기 ↑
 */
export default function GlassHome() {
  return (
    <Link
      href="/"
      aria-label="Go to home"
      className="
        fixed z-20
        top-3 left-3 md:top-6 md:left-6
        grid place-items-center
        h-10 w-10 md:h-12 md:w-12
        rounded-full border border-white/25
        bg-white/10 backdrop-blur-md
        shadow-md
        transition duration-200
        hover:bg-white/20"
    >
      <Home size={20} className="md:size-6 text-white" strokeWidth={2.2} />
    </Link>
  );
}
