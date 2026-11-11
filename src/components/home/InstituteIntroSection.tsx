import React from 'react';
import { Target, Compass, Sparkles, ShieldCheck, ArrowRight, Laptop, Award } from 'lucide-react';

interface InstituteIntroSectionProps {
  onExploreCourses: () => void;
  onViewAbout?: () => void;
}

export const InstituteIntroSection: React.FC<InstituteIntroSectionProps> = ({
  onExploreCourses,
  onViewAbout,
}) => {
  return (
    <section className="py-16 sm:py-24 bg-[#050b1a] border-y border-white/5 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission & Identity (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-400/30 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>About ZA Global Tech Institute</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight leading-tight">
              An International Digital Academy Built for{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                Real-World Tech Mastery.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Founded and directed by <strong className="text-white">Zohaib Ali</strong>, <strong className="text-white">ZA GLOBAL TECH INSTITUTE</strong> was created to eliminate the gap between traditional academic theory and the practical, high-earning digital skills demanded by global employers and freelancing clients.
            </p>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              Whether you are an ambitious beginner stepping into artificial intelligence, an aspiring full-stack web developer, or an experienced freelancer looking to automate client workflows, our curriculum is engineered for immediate commercial applicability. We provide both 100% Free foundational learning tracks and intensive Paid professional masterclasses with complete mentor feedback.
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <Laptop className="w-5 h-5 text-cyan-400 mb-2" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Space_Grotesk']">
                  Project-First Delivery
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Build production-ready codebases and commercial portfolio pieces.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <Target className="w-5 h-5 text-amber-400 mb-2" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Space_Grotesk']">
                  Global Market Alignment
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Skills mapped directly to high-demand Upwork, Fiverr & remote jobs.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <Award className="w-5 h-5 text-emerald-400 mb-2" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Space_Grotesk']">
                  Verified Completion
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Earn digital certificates with unique serial numbers & QR validation.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreCourses}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
              >
                <span>Browse All Curriculum Tracks</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onViewAbout && (
                <button
                  onClick={onViewAbout}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 text-xs font-semibold transition-all"
                >
                  Read Institute Story
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Visual Philosophy Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0d1a38] via-[#09142e] to-[#040918] border border-cyan-500/30 shadow-2xl relative">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Compass className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                    Institute Motto
                  </span>
                  <blockquote className="text-xl sm:text-2xl font-bold text-white font-['Space_Grotesk'] leading-snug">
                    "LEARN TODAY. BUILD TOMORROW. LEAD THE FUTURE."
                  </blockquote>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Free Learning with Zero Gatekeeping (PKR 0)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Structured Unlisted HD Video Lectures</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Assignments, Quizzes & Verified Credentials</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Direct Guidance from Founder Zohaib Ali</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-slate-200">Institutional Transparency:</strong> ZA Global Tech Institute is a private online professional technology academy. All completion credentials certify fulfillment of our rigorous internal project curriculum.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
