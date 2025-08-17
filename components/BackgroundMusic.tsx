'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // 1초 후 강제로 로딩 완료 처리
    const timer = setTimeout(() => {
      setIsLoaded(true);
      console.log('🎵 Music ready (forced)');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Play failed:', error);
      }
    }
  };

  return (
    <>
      {/* 숨겨진 오디오 엘리먼트 */}
      <audio
        ref={audioRef}
        preload="metadata"
        loop
        src="/assets/space-ambient.mp3"
      />

      {/* 음악 토글 버튼 - 에러가 없을 때만 표시 */}
      {!hasError && (
        <button
          onClick={toggleMusic}
          className={`
            fixed bottom-6 right-6 z-40
            w-12 h-12 rounded-full
            bg-white/10 backdrop-blur-md border border-white/20
            flex items-center justify-center
            transition-all duration-300 cursor-pointer
            hover:bg-white/20 hover:scale-110
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isPlaying ? 'text-blue-300' : 'text-white/70'}
          `}
          title={isPlaying ? 'Pause ambient music' : 'Play ambient music'}
          aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
        >
          {isPlaying ? (
            <Volume2 size={20} />
          ) : (
            <VolumeX size={20} />
          )}
        </button>
      )}
    </>
  );
}