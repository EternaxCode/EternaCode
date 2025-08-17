// pages/index.tsx
import Head from 'next/head';
import { Code2, Zap, Shield, Globe } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Head><title>EternaxCode - AI-Native Web & App Studio</title></Head>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="flex items-center justify-center min-h-screen px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Alive Code,<br />Infinite Evolution
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              AI-Native web & app studio building <strong>self-healing</strong> and <strong>self-upgrading</strong> software powered by our RAXI engine
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-sm">
                🔬 RAXI Engine in Development
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
              Why Choose EternaxCode?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Code2 size={32} />}
                title="Alive Code"
                description="Self-healing software that evolves and adapts automatically"
              />
              <FeatureCard
                icon={<Zap size={32} />}
                title="Zero Downtime"
                description="99.999% uptime with automatic recovery within 1 minute"
              />
              <FeatureCard
                icon={<Shield size={32} />}
                title="Ever-Green"
                description="Dependencies and security patches auto-merged safely"
              />
              <FeatureCard
                icon={<Globe size={32} />}
                title="Open Standards"
                description="Ships as pure React/Next.js/Kubernetes manifests"
              />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-transparent to-black/20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
              Our Services
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <ServiceCard
                title="Web Development"
                description="Modern, responsive websites with AI-powered maintenance"
                features={["React/Next.js", "Auto-optimization", "Performance monitoring"]}
                href="/product"
              />
              <ServiceCard
                title="App Development"
                description="Mobile and desktop applications that self-update"
                features={["Cross-platform", "Self-healing", "Real-time analytics"]}
                href="/product"
              />
              <ServiceCard
                title="AI Integration"
                description="RAXI engine integration for existing systems"
                features={["Legacy modernization", "AI blueprinting", "Continuous testing"]}
                href="/contact"
              />
            </div>
          </div>
        </section>

        {/* Innovation Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              The Future of Software Development
            </h2>
            <p className="text-lg text-white/80 mb-8">
              RAXI Engine is currently powering our internal development processes, learning and evolving with every line of code.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="text-2xl mb-3">🧠</div>
                <h3 className="font-semibold text-white mb-2">AI Learning</h3>
                <p className="text-white/70 text-sm">Continuously improving from real-world code patterns</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="text-2xl mb-3">⚡</div>
                <h3 className="font-semibold text-white mb-2">Auto-Optimization</h3>
                <p className="text-white/70 text-sm">Self-healing infrastructure with zero-downtime deployments</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="text-2xl mb-3">🚀</div>
                <h3 className="font-semibold text-white mb-2">Coming Soon</h3>
                <p className="text-white/70 text-sm">Public release planned for enterprise partners</p>
              </div>
            </div>
          </div>
        </section>
      </main>
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
      group p-6 rounded-2xl
      bg-white/5 border border-white/10
      backdrop-blur-sm hover:bg-white/10
      transition-all duration-300 hover:scale-105 hover:border-white/20
      cursor-pointer
    ">
      <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70 text-sm">{description}</p>
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
      group p-8 rounded-2xl
      bg-white/5 border border-white/10
      backdrop-blur-sm hover:bg-white/10
      transition-all duration-300 hover:scale-105 hover:border-white/20
      cursor-pointer
    ">
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-white/80 mb-6">{description}</p>
      <ul className="space-y-2 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="text-white/70 text-sm flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
            {feature}
          </li>
        ))}
      </ul>
      <div className="inline-flex items-center gap-2 text-white/60 font-medium text-sm">
        Internal Development
      </div>
    </div>
  );
}
