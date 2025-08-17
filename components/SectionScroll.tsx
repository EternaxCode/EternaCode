'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SectionScrollProps {
  children: ReactNode[];
  className?: string;
}

export default function SectionScroll({ children, className = '' }: SectionScrollProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  const totalSections = children.length;

  // 스크롤 방향 감지 및 섹션 전환
  const scrollToSection = (direction: 'up' | 'down') => {
    if (isScrolling) return;

    let nextSection = currentSection;
    
    if (direction === 'down' && currentSection < totalSections - 1) {
      nextSection = currentSection + 1;
    } else if (direction === 'up' && currentSection > 0) {
      nextSection = currentSection - 1;
    }

    if (nextSection !== currentSection) {
      setIsScrolling(true);
      setCurrentSection(nextSection);
      
      // 스크롤 완료 후 다시 활성화
      setTimeout(() => setIsScrolling(false), 800);
    }
  };

  // 휠 이벤트 처리
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (Math.abs(e.deltaY) < 10) return; // 작은 스크롤 무시
      
      const direction = e.deltaY > 0 ? 'down' : 'up';
      scrollToSection(direction);
    };

    // 키보드 이벤트 처리
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ': // 스페이스바
          e.preventDefault();
          scrollToSection('down');
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          scrollToSection('up');
          break;
        case 'Home':
          e.preventDefault();
          if (!isScrolling) {
            setCurrentSection(0);
            setIsScrolling(true);
            setTimeout(() => setIsScrolling(false), 800);
          }
          break;
        case 'End':
          e.preventDefault();
          if (!isScrolling) {
            setCurrentSection(totalSections - 1);
            setIsScrolling(true);
            setTimeout(() => setIsScrolling(false), 800);
          }
          break;
      }
    };

    // 터치 이벤트 처리
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;
      
      if (Math.abs(diff) > 50) { // 최소 50px 이동
        const direction = diff > 0 ? 'down' : 'up';
        scrollToSection(direction);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [currentSection, isScrolling, totalSections]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ height: '100vh' }}
    >
      {/* 섹션 컨테이너 */}
      <motion.div
        animate={{ y: `-${currentSection * 100}vh` }}
        transition={{ 
          duration: 0.8, 
          ease: [0.22, 1, 0.36, 1] 
        }}
        className="relative"
      >
        {children.map((section, index) => (
          <div
            key={index}
            className="relative flex items-center justify-center"
            style={{ 
              height: '100vh',
              minHeight: '100vh',
              paddingTop: '4rem', // Navigation 높이 (64px)
              paddingBottom: '5rem' // Footer 높이 (80px) 
            }}
          >
            <div className="w-full">
              {section}
            </div>
          </div>
        ))}
      </motion.div>

      {/* 섹션 인디케이터 */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-30 space-y-3">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isScrolling) {
                setCurrentSection(index);
                setIsScrolling(true);
                setTimeout(() => setIsScrolling(false), 800);
              }
            }}
            className={`
              w-3 h-3 rounded-full border-2 border-white/30 
              transition-all duration-300 cursor-pointer
              hover:scale-125
              ${currentSection === index 
                ? 'bg-white border-white shadow-lg' 
                : 'bg-transparent hover:bg-white/20'
              }
            `}
            title={`섹션 ${index + 1}`}
          />
        ))}
      </div>

      {/* 스크롤 힌트 (첫 번째 섹션에서만) */}
      {currentSection === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 text-white/60 text-sm flex flex-col items-center"
        >
          <div className="mb-2">스크롤하여 더 보기</div>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              ease: "easeInOut" 
            }}
          >
            ↓
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}