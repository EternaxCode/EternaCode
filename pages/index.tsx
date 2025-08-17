// pages/index.tsx
import Head from 'next/head';
import { Code2, Zap, Shield, Globe } from 'lucide-react';
import StaggerContainer, { StaggerItem } from '@/components/StaggerContainer';
import SectionScroll from '@/components/SectionScroll';

export default function Home() {
  return (
    <>
      <Head><title>EternaxCode - AI-Native Web & App Studio</title></Head>

      <SectionScroll>
        {/* Hero Section */}
        <section>
          <StaggerContainer className="max-w-4xl mx-auto text-center">
            <StaggerItem>
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent px-2">
                Alive Code,<br />Infinite Evolution
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
                AI-Native web & app studio building <strong>self-healing</strong> and <strong>self-upgrading</strong> software powered by our RAXI engine
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
                <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm">
                  🔬 RAXI Engine in Development
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* Features Section */}
        <section>
          <StaggerContainer className="max-w-6xl mx-auto px-4" delay={0.2}>
            <StaggerItem>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 text-white">
                Why Choose EternaxCode?
              </h2>
            </StaggerItem>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <StaggerItem>
                <FeatureCard
                  icon={<Code2 size={24} />}
                  title="Alive Code"
                  description="Self-healing software that evolves and adapts automatically"
                />
              </StaggerItem>
              <StaggerItem>
                <FeatureCard
                  icon={<Zap size={24} />}
                  title="Zero Downtime"
                  description="99.999% uptime with automatic recovery within 1 minute"
                />
              </StaggerItem>
              <StaggerItem>
                <FeatureCard
                  icon={<Shield size={24} />}
                  title="Ever-Green"
                  description="Dependencies and security patches auto-merged safely"
                />
              </StaggerItem>
              <StaggerItem>
                <FeatureCard
                  icon={<Globe size={24} />}
                  title="Open Standards"
                  description="Ships as pure React/Next.js/Kubernetes manifests"
                />
              </StaggerItem>
            </div>
          </StaggerContainer>
        </section>

        {/* Services Section */}
        <section className="bg-gradient-to-b from-transparent to-black/20">
          <StaggerContainer className="max-w-6xl mx-auto px-4" delay={0.3}>
            <StaggerItem>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 md:mb-16 text-white">
                Our Services
              </h2>
            </StaggerItem>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <StaggerItem>
                <ServiceCard
                  title="Web Development"
                  description="Modern, responsive websites with AI-powered maintenance"
                  features={["React/Next.js", "Auto-optimization", "Performance monitoring"]}
                  href="/product"
                />
              </StaggerItem>
              <StaggerItem>
                <ServiceCard
                  title="App Development"
                  description="Mobile and desktop applications that self-update"
                  features={["Cross-platform", "Self-healing", "Real-time analytics"]}
                  href="/product"
                />
              </StaggerItem>
              <StaggerItem>
                <ServiceCard
                  title="AI Integration"
                  description="RAXI engine integration for existing systems"
                  features={["Legacy modernization", "AI blueprinting", "Continuous testing"]}
                  href="/contact"
                />
              </StaggerItem>
            </div>
          </StaggerContainer>
        </section>

        {/* Innovation Section */}
        <section>
          <StaggerContainer className="max-w-4xl mx-auto text-center px-4" delay={0.4}>
            <StaggerItem>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">
                The Future of Software Development
              </h2>
            </StaggerItem>
            <StaggerItem>
              <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8">
                RAXI Engine is currently powering our internal development processes, learning and evolving with every line of code.
              </p>
            </StaggerItem>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <StaggerItem>
                <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                  <div className="text-2xl mb-3">🧠</div>
                  <h3 className="font-semibold text-white mb-2">AI Learning</h3>
                  <p className="text-white/70 text-sm">Continuously improving from real-world code patterns</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                  <div className="text-2xl mb-3">⚡</div>
                  <h3 className="font-semibold text-white mb-2">Auto-Optimization</h3>
                  <p className="text-white/70 text-sm">Self-healing infrastructure with zero-downtime deployments</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                  <div className="text-2xl mb-3">🚀</div>
                  <h3 className="font-semibold text-white mb-2">Coming Soon</h3>
                  <p className="text-white/70 text-sm">Public release planned for enterprise partners</p>
                </div>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </section>
      </SectionScroll>
    </>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="
      group p-4 sm:p-6 rounded-2xl
      bg-white/5 border border-white/10
      backdrop-blur-sm hover:bg-white/10
      transition-all duration-300 hover:scale-105 hover:border-white/20
      cursor-pointer
    ">
      <div className="text-blue-400 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center sm:justify-start">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 text-center sm:text-left">{title}</h3>
      <p className="text-white/70 text-xs sm:text-sm text-center sm:text-left leading-relaxed">{description}</p>
    </div>
  );
}

function ServiceCard({ title, description, features, href }: {
  title: string;
  description: string;
  features: string[];
  href: string;
}) {
  return (
    <div className="
      group p-4 sm:p-6 md:p-8 rounded-2xl
      bg-white/5 border border-white/10
      backdrop-blur-sm hover:bg-white/10
      transition-all duration-300 hover:scale-105 hover:border-white/20
      cursor-pointer
    ">
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 text-center sm:text-left">{title}</h3>
      <p className="text-white/80 mb-4 sm:mb-6 text-sm sm:text-base text-center sm:text-left">{description}</p>
      <ul className="space-y-2 mb-6 sm:mb-8">
        {features.map((feature, index) => (
          <li key={index} className="text-white/70 text-xs sm:text-sm flex items-center gap-2 justify-center sm:justify-start">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
            {feature}
          </li>
        ))}
      </ul>
      <div className="inline-flex items-center gap-2 text-white/60 font-medium text-xs sm:text-sm justify-center w-full sm:justify-start sm:w-auto">
        Internal Development
      </div>
    </div>
  );
}
