import React from 'react';
import {
  Video,
  DollarSign,
  Award,
  Users,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const pillars = [
    {
      icon: Video,
      title: 'YouTube HD Curated Curriculum',
      description: 'Stream seamless, high-definition unlisted lectures with zero buffering, downloadable PDF resource attachments, and sequential tracking.',
      color: 'text-amber-400 bg-amber-500/10 border-amber-400/20',
    },
    {
      icon: DollarSign,
      title: 'Transparent PKR Pricing & Free Tracks',
      description: 'Access high-impact technology education for free (PKR 0) or enroll in premium masterclasses at student-friendly domestic rates.',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-400/20',
    },
    {
      icon: Award,
      title: 'Verified Digital Certificates',
      description: 'Earn cryptographic QR-coded completion certificates issued directly by founder Zohaib Ali with instant public validation lookup.',
      color: 'text-blue-400 bg-blue-500/10 border-blue-400/20',
    },
    {
      icon: Cpu,
      title: 'Next-Gen Technology Stack',
      description: 'Master Artificial Intelligence, Prompt Engineering, Large Language Models, React 19, and Full Stack Web Architecture.',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-400/20',
    },
    {
      icon: CreditCard,
      title: 'Pakistani & Global Payment Gateways',
      description: 'Pay securely using EasyPaisa, JazzCash, Meezan Bank Transfer, or Debit Card with manual receipt verification and instant enrollment.',
      color: 'text-rose-400 bg-rose-500/10 border-rose-400/20',
    },
    {
      icon: Users,
      title: 'Founder Mentorship & Career Guidance',
      description: 'Direct freelancing masterclasses on Upwork and Fiverr from founder Zohaib Ali to help you land high-paying international contracts.',
      color: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
    },
  ];

  return (
    <section className="py-20 bg-[#070d1e] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-xs font-bold text-blue-400 tracking-wider uppercase">
            <span>Why Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            An International Standard of Digital Education
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Founded with a clear purpose: to bridge the gap between academic theory and practical commercial technology skills that earn in today's digital economy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#0f1c3d]/70 border border-white/5 hover:border-amber-400/30 hover:bg-[#0f1c3d] transition-all duration-300 space-y-4 group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${p.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors font-['Space_Grotesk']">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
