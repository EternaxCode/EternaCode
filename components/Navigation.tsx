'use client';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Info, Package, Mail } from 'lucide-react';
import Image from 'next/image';
import { useCallback } from 'react';
import { UI } from '@/lib/uiConstants';
import { rgba } from '@/lib/colorUtils';
import {
  springCameraFov,
  overlayControls,
  starfieldBackground,
} from '@/components/StarfieldCanvas';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'About', href: '/about', icon: Info },
  { label: 'Product', href: '/product', icon: Package },
  { label: 'Contact', href: '/contact', icon: Mail },
];

export default function Navigation() {
  const router = useRouter();

  // 우주 이동 효과를 포함한 페이지 전환
  const navigateWithEffect = useCallback(async (href: string) => {
    if (router.pathname === href) return; // 같은 페이지면 무시

    // 테마 색상 결정
    const themeHex = 
      href === '/' ? UI.THEME.default :
      href === '/about' ? UI.THEME.about :
      href === '/product' ? UI.THEME.product :
      href === '/contact' ? UI.THEME.contact :
      UI.THEME.default;

    try {
      // 1) FOV 축소 (우주로 빨려들어가는 효과)
      springCameraFov(UI.WORMHOLE.fovFar);
      
      // 2) Starfield 배경 색상 변경
      starfieldBackground.set(themeHex, UI.WORMHOLE.duration * 1000);

      // 3) 오버레이 색상으로 전환 효과
      if (overlayControls.current) {
        await overlayControls.current.start({
          backgroundColor: rgba(themeHex, 0.35),
          transition: { duration: UI.WORMHOLE.duration, ease: 'easeOut' },
        });
      }

      // 4) 페이지 이동
      await router.push(href);
    } catch (error) {
      console.error('Navigation error:', error);
      // 에러가 발생해도 페이지는 이동
      router.push(href);
    }
  }, [router]);

  return (
    <nav className="
      fixed top-0 left-0 right-0 z-30
      flex items-center justify-between
      px-4 py-3 md:px-6 md:py-4
      bg-black/20 backdrop-blur-md border-b border-white/10
      transition-all duration-300
    ">
      {/* Logo/Brand - Left */}
      <div className="flex-shrink-0">
        <button 
          onClick={() => navigateWithEffect('/')}
          className="
            flex items-center justify-start gap-2 
            text-lg md:text-xl font-bold text-white/95
            hover:text-white transition-colors
            min-w-0 flex-shrink-0 border-none outline-none
            cursor-pointer
          "
        >
          <div className="w-6 h-6 md:w-6 md:h-6 flex items-center justify-center flex-shrink-0">
            <Image
              src="/assets/ico-about.svg"
              alt="EternaxCode Logo"
              width={316}
              height={394}
              className="w-5 h-6 object-contain filter brightness-0 invert"
            />
          </div>
          <span className="hidden sm:inline whitespace-nowrap text-white/95">EternaxCode</span>
        </button>
      </div>

      {/* Navigation Links - Center */}
      <div className="flex items-center gap-1 md:gap-2 absolute left-1/2 transform -translate-x-1/2">
        {navItems.map((item) => {
          const isActive = router.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <button
              key={item.href}
              onClick={() => navigateWithEffect(item.href)}
              className={`
                flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2
                rounded-full text-sm font-medium border-none outline-none
                transition-all duration-200 cursor-pointer
                ${isActive 
                  ? 'bg-white/20 text-white shadow-lg' 
                  : 'text-white/90 hover:text-white hover:bg-white/15'
                }
                sm:justify-start
              `}
            >
              <Icon size={16} className="md:size-4 mx-auto sm:mx-0" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Empty space for balance */}
      <div className="flex-shrink-0 w-24 md:w-32"></div>
    </nav>
  );
}