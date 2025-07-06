'use client';

import Image from 'next/image';
import CenterPanel from '@/components/CenterPanel';

/** 
 * “Magazine-style” About 페이지
 *  - Hero → 전폭(Full-bleed) 배너
 *  - 이어지는 섹션은 2-열 Masonry(가변) 그리드
 *  - 이미지와 텍스트 컬럼을 교차(A–B, B–A) 배치해 리듬감 생성
 */
export default function About() {
  return (
    <CenterPanel>
      {/* ─────────── HERO full-bleed ─────────── */}
      <figure className="relative mb-12">
        <Image
          src="/about-hero.png"
          alt="Alive Code, Infinite Evolution"
          priority
          width={2400}
          height={840}
          className="w-full h-auto rounded-xl shadow-2xl"
        />
        <figcaption className="absolute bottom-4 right-6 text-sm text-[var(--text-sub)] italic">
          Alive Code, Infinite Evolution
        </figcaption>
      </figure>

      {/* ─────────── MAGAZINE GRID ─────────── */}
      <article className="grid gap-y-16 md:gap-y-24">
        {/* 한 섹션 = 이미지+텍스트 (lg 이상 2-열) */}
        <Section
          img={{ src: '/alive-vs-traditional.png', w: 1000, h: 480, alt: 'Alive vs. Traditional' }}
          title="What is “Alive Code”?"
          order="img-text"
        >
          <p>
            <strong>Outcome</strong> → 99.999 % uptime, minimal tech debt, and developers focusing
            on creative problem-solving instead of firefighting.
          </p>
        </Section>

        <Section
          img={{ src: '/raxi-diagram.png', w: 1000, h: 400, alt: 'RAXI data-flow diagram' }}
          title="RAXI Engine Overview"
          order="text-img"
        >
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong>AI Blueprinting</strong> – Natural-language → architecture → code skeleton</li>
            <li><strong>Continuous Self-Test</strong> – LLM-generated tests &amp; regression checks</li>
            <li><strong>Adaptive Ops</strong> – Real-time metrics drive auto-scaling &amp; traffic shift</li>
            <li><strong>Incremental Refactor</strong> – Quality drop/CVE ⇒ auto PR → zero-downtime deploy</li>
          </ol>
        </Section>

        <Section
          title="Who We Are"
          order="text-only"
        >
          <p>
            <strong>EternaxCode</strong> is an <em>AI-Native web &amp; app studio</em>.  
            We build <strong>Alive Code</strong>: software that <strong>self-heals</strong> and
            <strong> self-upgrades</strong>, powered by our in-house AI system <strong>RAXI</strong>.
          </p>
        </Section>

        <Section
          title="Vision & Principles"
          order="text-only"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-lg p-5 backdrop-blur-sm shadow-inner">
              <h3 className="font-semibold text-center mb-2">Vision</h3>
              <p className="text-sm leading-relaxed">
                <strong>“Code must be alive.”</strong><br />
                Software as an <strong>ever-evolving organism.</strong>
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-5 backdrop-blur-sm shadow-inner">
              <h3 className="font-semibold text-center mb-2">Core Principles</h3>
              <ul className="text-sm list-disc pl-5 space-y-1">
                <li><strong>Self-Everything</strong> – automate all repetition</li>
                <li><strong>Radical Transparency</strong> – live metrics &amp; change logs</li>
                <li><strong>Sustainability</strong> – green regions &amp; carbon monitoring</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section
          title="Why EternaxCode?"
          order="text-only"
        >
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Zero-Downtime Resilience</strong> – self-recovery within 1 minute</li>
            <li><strong>Ever-Green Codebase</strong> – dependencies &amp; security patches auto-merged</li>
            <li><strong>Developer Freedom</strong> – write ideas, not YAML; run experiments, not sprints</li>
            <li><strong>Open Standard Output</strong> – ships as pure React / Next.js / Kubernetes manifests</li>
          </ul>
        </Section>
      </article>
    </CenterPanel>
  );
}

/* ────────── 섹션 컴포넌트 ────────── */
type Img = { src: string; w: number; h: number; alt: string };

function Section({
  img,
  title,
  children,
  order = 'img-text',
}: {
  img?: Img;
  title: React.ReactNode;
  children: React.ReactNode;
  order?: 'img-text' | 'text-img' | 'text-only';
}) {
  const hasImg = Boolean(img);
  const isReversed = order === 'text-img';
  return (
    <section
      className={`grid gap-8 items-center ${hasImg ? 'md:grid-cols-2' : ''} ${
        isReversed ? 'md:[&>*:first-child]:order-2' : ''
      }`}
    >
      {img && (
        <Image
          src={img.src}
          alt={img.alt}
          width={img.w}
          height={img.h}
          className="w-full h-auto rounded-lg shadow-md"
        />
      )}
      <div>
        <h2 className="text-2xl font-bold mb-3">{title}</h2>
        <div className="space-y-4 text-[17px]/relaxed">{children}</div>
      </div>
    </section>
  );
}
