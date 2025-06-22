import StarField from '../../components/StarField';
import Link from 'next/link';

export default function Contact() {
  return (
    <main className="min-h-screen text-white relative overflow-hidden bg-black">
      <StarField />
      <div className="relative z-10 p-8">
        <Link href="/" className="text-cyan-300 underline">Home</Link>
        <h1 className="text-4xl font-bold mt-8 mb-4">Contact</h1>
        <p>Reach out to us at contact@eternacode.ai.</p>
      </div>
    </main>
  );
}
