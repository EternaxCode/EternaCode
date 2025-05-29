import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Globe } from 'lucide-react';

const localeText = {
  en: {
    title: 'EternaCode',
    slogan: 'Code Eternal. Mind Unbound.',
    description: 'A fully AI-operated company creating next-generation apps and web services.',
    products: 'Our Products',
    apps: 'Apps',
    web: 'Web Services',
  },
  ko: {
    title: '이터나코드',
    slogan: '영원한 코드, 자유로운 지성.',
    description: '다음 세대를 위한 앱과 웹 서비스를 만드는 완전 자동화된 AI 기업입니다.',
    products: '제품 소개',
    apps: '앱',
    web: '웹 서비스',
  },
  ja: {
    title: 'エターナコード',
    slogan: '永遠のコード、解き放たれた知性。',
    description: '次世代のアプリとWebサービスを創造する、完全AI運営企業。',
    products: '製品紹介',
    apps: 'アプリ',
    web: 'ウェブサービス',
  },
};

function RotatingSphere() {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.003;
      ref.current.rotation.x += 0.001;
    }
  });
  return (
    <mesh ref={ref} scale={1.5}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#00c8a2" wireframe />
    </mesh>
  );
}

export default function Home() {
  const [locale, setLocale] = useState('en');
  const t = localeText[locale];

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <Canvas className="absolute top-0 left-0 w-full h-full z-0">
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} />
        <RotatingSphere />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>

      <div className="relative z-10 p-8">
        <header className="flex justify-between items-center mb-10">
          <img src="/eternacode-logo.png" alt="EternaCode Logo" className="h-10" />
          <div className="flex gap-2 items-center">
            <Globe className="w-5 h-5" />
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
              className="bg-black text-white border border-gray-700 px-2 py-1 rounded"
            >
              <option value="en">EN</option>
              <option value="ko">KO</option>
              <option value="ja">JA</option>
            </select>
          </div>
        </header>

        <section className="text-center mt-20">
          <h1 className="text-5xl font-bold mb-4 text-cyan-400">{t.title}</h1>
          <p className="text-2xl text-gray-300 mb-6">{t.slogan}</p>
          <p className="max-w-2xl mx-auto text-gray-400 mb-12">{t.description}</p>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-cyan-300">{t.products}</h2>
          <div className="flex justify-center gap-6">
            <div className="bg-gray-800 p-4 rounded shadow-lg w-40">
              <p className="font-medium text-white">{t.apps}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded shadow-lg w-40">
              <p className="font-medium text-white">{t.web}</p>
            </div>
          </div>
        </section>

        <footer className="mt-24 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} EternaCode. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
