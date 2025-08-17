import Head from 'next/head';

export default function Product() {
  return (
    <>
      <Head><title>Product - EternaxCode</title></Head>
      
      <main className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Coming Soon
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Revolutionary products are being crafted in our AI laboratory
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm">
            🚀 RAXI Engine in Development
          </div>
        </div>
      </main>
    </>
  );
}
