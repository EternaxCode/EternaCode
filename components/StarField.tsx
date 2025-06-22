// components/Starfield.tsx
import { useStarfield } from '@/hooks/useStarfield';

export default function Starfield() {
  const mountRef = useStarfield();

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    />
  );
}
