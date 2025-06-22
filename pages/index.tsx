import { Star } from 'lucide-react';
import dynamic from 'next/dynamic';
const PolyBackground = dynamic(() => import('../components/PolyBackground'), { ssr: false });
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [warp, setWarp] = useState('');

  const handleWarp = (path: string) => {
    setWarp(path);
    setTimeout(() => router.push(path), 300);
  };

  const starClass = (path: string) =>
    `transition-transform duration-300 ${warp === path ? 'scale-150' : 'hover:scale-125'}`;

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <PolyBackground />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-10">Eterna Galaxy</h1>
        <div className="flex gap-12">
          <button onClick={() => handleWarp('/about')} className={starClass('/about')}>
            <Star className="w-12 h-12 text-yellow-300" />
            <span className="sr-only">About</span>
          </button>
          <button onClick={() => handleWarp('/product')} className={starClass('/product')}>
            <Star className="w-12 h-12 text-yellow-300" />
            <span className="sr-only">Product</span>
          </button>
          <button onClick={() => handleWarp('/contact')} className={starClass('/contact')}>
            <Star className="w-12 h-12 text-yellow-300" />
            <span className="sr-only">Contact</span>
          </button>
        </div>
      </div>
    </main>
  );
}
