'use client';

import Head from 'next/head';
import { Code2, Zap, Shield, Users, Target, Lightbulb } from 'lucide-react';
import SectionScroll from '@/components/SectionScroll';
import StaggerContainer, { StaggerItem } from '@/components/StaggerContainer';

export default function About() {
  return (
    <>
      <Head><title>About EternaxCode - AI-Native Development Studio</title></Head>

      <SectionScroll>
        {/* Hero Section */}
        <section className="px-6">
          <StaggerContainer className="max-w-4xl mx-auto text-center">
            <StaggerItem>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm mb-6">
                  <Code2 size={16} className="text-blue-400" />
                  About EternaxCode
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Code Must Be Alive
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                We believe software should evolve, heal, and grow autonomously. 
                EternaxCode pioneers <strong>Alive Code</strong> – systems that think, adapt, and improve themselves.
              </p>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* Story Section */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Our Story</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Born from frustration with brittle software and endless maintenance cycles
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <StoryCard
                icon={<Target size={32} />}
                title="The Problem"
                description="Traditional software breaks, becomes outdated, and requires constant manual intervention. Developers spend 80% of their time maintaining, not creating."
              />
              <StoryCard
                icon={<Lightbulb size={32} />}
                title="Our Vision"
                description="Software that lives and breathes. Code that monitors itself, fixes bugs automatically, and evolves with changing requirements without human intervention."
              />
              <StoryCard
                icon={<Zap size={32} />}
                title="The Solution"
                description="RAXI Engine - our AI system that transforms static code into living, self-improving organisms. 99.999% uptime with minimal human oversight."
              />
            </div>
          </div>
        </section>

        {/* RAXI Engine Section */}
        <section className="px-6 bg-gradient-to-b from-transparent to-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">RAXI Engine</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                The brain behind Alive Code - our proprietary AI system that makes software truly autonomous
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ProcessCard
                step="01"
                title="AI Blueprinting"
                description="Natural language requirements transform into architectural diagrams and code skeletons automatically."
              />
              <ProcessCard
                step="02"
                title="Continuous Self-Test"
                description="AI generates comprehensive test suites and regression checks that evolve with the codebase."
              />
              <ProcessCard
                step="03"
                title="Adaptive Operations"
                description="Real-time metrics drive automatic scaling, traffic routing, and performance optimization."
              />
              <ProcessCard
                step="04"
                title="Incremental Evolution"
                description="Quality drops trigger automatic refactoring. Security issues generate and deploy patches instantly."
              />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Our Values</h2>
              <p className="text-lg text-white/80">The principles that guide everything we build</p>
            </div>

            <div className="space-y-12">
              <ValueCard
                title="Self-Everything"
                subtitle="Automate all repetition"
                description="If humans have to do it twice, the system should learn to do it automatically. We eliminate toil, not jobs."
              />
              <ValueCard
                title="Radical Transparency"
                subtitle="Live metrics & change logs"
                description="Every decision, every change, every metric is visible. Our systems explain their reasoning in real-time."
              />
              <ValueCard
                title="Sustainability First"
                subtitle="Green regions & carbon monitoring"
                description="Alive Code optimizes for environmental impact. Efficient code isn't just faster - it's our responsibility to the planet."
              />
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="px-6 bg-gradient-to-b from-black/20 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Who We Are</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                A diverse team of engineers, researchers, and visionaries united by one belief: 
                <strong> software should serve humanity, not the other way around.</strong>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
                <Users size={48} className="text-blue-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">AI-Native Team</h3>
                <p className="text-white/90">Engineers who think in autonomous systems and self-improving architectures</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
                <Shield size={48} className="text-purple-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Security First</h3>
                <p className="text-white/90">Former security researchers building unhackable, self-defending systems</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
                <Code2 size={48} className="text-green-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Open Standards</h3>
                <p className="text-white/90">Believers in open source, interoperability, and developer freedom</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Make Your Code Alive?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Join us in building the future where software evolves as fast as your ideas.
            </p>
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-sm">
                🔬 RAXI Engine - Internal Development Phase
              </div>
            </div>
          </div>
        </section>
      </SectionScroll>
    </>
  );
}

function StoryCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center text-blue-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <p className="text-white/90 leading-relaxed">{description}</p>
    </div>
  );
}

function ProcessCard({ step, title, description }: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="relative">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
          {step}
        </div>
        <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
        <p className="text-white/90 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function ValueCard({ title, subtitle, description }: {
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-blue-300 font-medium mb-4">{subtitle}</p>
      <p className="text-white/90 leading-relaxed">{description}</p>
    </div>
  );
}