import Head from 'next/head';
import { Mail, MessageSquare, Calendar, Send } from 'lucide-react';
import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // EmailJS 설정
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
        formRef.current,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
      );
      
      setSubmitMessage('Message sent successfully! We\'ll get back to you soon.');
      formRef.current.reset();
    } catch (error) {
      setSubmitMessage('Failed to send message. Please try again or contact us directly.');
      console.error('Email sending failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head><title>Contact - EternaxCode</title></Head>
      
      <main className="min-h-screen py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Interested in RAXI Engine or have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Mail size={24} className="text-blue-300" />
                Send us a message
              </h2>
              <p className="text-white/70 text-sm mb-6">
                Messages will be sent directly to <span className="text-blue-300 font-medium">support@eternaxcode.com</span>
              </p>
              
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                {/* Hidden field for destination email */}
                <input type="hidden" name="to_email" value="support@eternaxcode.com" />
                
                <div>
                  <label htmlFor="from_name" className="block text-sm font-medium text-white mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="from_name"
                    name="from_name"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="reply_to" className="block text-sm font-medium text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="reply_to"
                    name="reply_to"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all resize-none"
                    placeholder="Tell us about your project or ask us anything..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 disabled:scale-100 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>

                {submitMessage && (
                  <div className={`text-center p-3 rounded-lg ${
                    submitMessage.includes('successfully') 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <ContactCard
                icon={<Mail size={32} />}
                title="Email Us"
                description="support@eternaxcode.com"
              />
              <ContactCard
                icon={<MessageSquare size={32} />}
                title="RAXI Engine Inquiries"
                description="For partnership and enterprise discussions"
              />
              <ContactCard
                icon={<Calendar size={32} />}
                title="Development Updates"
                description="Follow our progress and announcements"
              />
              
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-3">Note</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  RAXI Engine is currently in internal development phase. We're actively working on making it available for enterprise partners. 
                  Reach out to learn more about our progress and future plans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function ContactCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer">
      <div className="text-blue-300 mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-white/70 text-sm">{description}</p>
    </div>
  );
}
