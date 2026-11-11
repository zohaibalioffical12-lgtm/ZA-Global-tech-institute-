import React, { useState } from 'react';
import { Logo } from './Logo.tsx';
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Award,
  ArrowRight,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { SiteSettings } from '../../types/index.ts';

interface FooterProps {
  settings?: SiteSettings | null;
  onNavigate: (tab: string, param?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setNewsletterEmail('');
    }, 4000);
  };

  return (
    <footer className="bg-[#050914] text-slate-400 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo
              customLogoUrl={settings?.logo_url}
              size="lg"
              showTagline={false}
            />
            <div className="pt-2">
              <span className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/20 rounded-full mb-3">
                Founder & Owner: {settings?.founder_name || 'Zohaib Ali'}
              </span>
              <p className="text-sm text-slate-300 leading-relaxed font-['Space_Grotesk'] text-amber-100/90 font-semibold italic">
                "{settings?.tagline || 'LEARN TODAY. BUILD TOMORROW. LEAD THE FUTURE.'}"
              </p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-sm">
                Empowering students across Pakistan and globally with hands-on, industry-standard digital skills in AI, full-stack programming, prompt engineering, and technology entrepreneurship.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings?.official_email || 'info@zaglobaltech.com'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings?.phone_number || '+92 300 1234567'} (WhatsApp Available)</span>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings?.address || 'ZA Global Tech Digital Campus, Karachi, Pakistan'}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Space_Grotesk']">
              Explore Campus
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-amber-400 transition-colors"
                >
                  All Tech Courses
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('free-courses')}
                  className="hover:text-amber-400 transition-colors text-emerald-400 font-medium"
                >
                  Free Opportunities (PKR 0)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('paid-courses')}
                  className="hover:text-amber-400 transition-colors text-blue-400 font-medium"
                >
                  Paid Masterclasses
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('founder')}
                  className="hover:text-amber-400 transition-colors text-cyan-300 font-semibold"
                >
                  Founder & CEO Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-400 transition-colors"
                >
                  About the Institute
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('team')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Our Professional Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('projects')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Student Portfolio Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('verify-certificate')}
                  className="hover:text-amber-400 transition-colors flex items-center gap-1 text-amber-300 font-semibold"
                >
                  <Award className="w-3.5 h-3.5" /> Verify Digital Certificate
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Space_Grotesk']">
              Featured Domains
            </h4>
            <ul className="space-y-2 text-xs">
              <li>Artificial Intelligence & LLMs</li>
              <li>Prompt Engineering</li>
              <li>Full Stack Web Development</li>
              <li>UI/UX Design & Figma</li>
              <li>Freelancing Mastery (Upwork & Fiverr)</li>
              <li>Cybersecurity Fundamentals</li>
              <li>AI Workflow Automation</li>
            </ul>
          </div>

          {/* Payment & Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Space_Grotesk']">
              Admissions & Updates
            </h4>
            <p className="text-xs text-slate-400">
              Subscribe to get announcements for new free course batches and founder webinars.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you! You are subscribed.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs flex items-center justify-center transition-all"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>
            )}

            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                Supported PKR Payment Channels:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-400 font-semibold">
                  EasyPaisa
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-rose-400 font-semibold">
                  JazzCash
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-blue-400 font-semibold">
                  Bank Transfer
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-400 font-semibold">
                  Debit / Card
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Legal Requirements */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span>
              &copy; {new Date().getFullYear()} ZA GLOBAL TECH INSTITUTE. Founded & Owned by Zohaib Ali.
            </span>
            <div className="flex items-center gap-3 text-slate-400">
              <button
                onClick={() => onNavigate('privacy')}
                className="hover:text-amber-400 transition-colors underline-offset-4 hover:underline"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigate('terms')}
                className="hover:text-amber-400 transition-colors underline-offset-4 hover:underline"
              >
                Terms of Service
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigate('contact')}
                className="hover:text-amber-400 transition-colors underline-offset-4 hover:underline"
              >
                Contact
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 max-w-xl text-center md:text-right">
            <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0 hidden sm:block" />
            <span>
              Disclaimer: ZA Global Tech Institute is a private online professional digital skills academy. Certificates verify internal course curriculum completion and project evaluation by the institute.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
