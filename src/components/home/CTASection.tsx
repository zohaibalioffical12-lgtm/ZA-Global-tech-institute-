import React from 'react';
import { Sparkles, ArrowRight, PlayCircle, ShieldCheck, Award, Users } from 'lucide-react';

interface CTASectionProps {
  onExploreCourses: () => void;
  onStartLearning: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  onExploreCourses,
  onStartLearning,
}) => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-[#030712] via-[#081329] to-[#040918] relative overflow-hidden border-t border-white/5">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-500/15 via-blue-600/15 to-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="p-8 sm:p-14 lg:p-16 rounded-3xl bg-gradient-to-br from-[#0c1836]/90 via-[#09142e]/90 to-[#050a1b]/95 border-2 border-cyan-500/30 shadow-2xl space-y-8 backdrop-blur-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-bold text-cyan-300 uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Enrollment Open For All Digital Skill Tracks</span>
          </div>

          {/* Headline */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-['Space_Grotesk'] tracking-tight leading-tight">
              Ready to Build Your Digital Future?
            </h2>
            <p className="text-sm sm:text-lg text-slate-300 font-sans leading-relaxed">
              Join ZA GLOBAL TECH INSTITUTE today. Start with our 100% Free foundational tracks or accelerate with intensive professional masterclasses mentored by industry experts.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onExploreCourses}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/20 transition-all duration-200 flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onStartLearning}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400/30 shadow-xl shadow-blue-600/30 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <PlayCircle className="w-4 h-4 text-cyan-300" />
              <span>Start Learning Free</span>
            </button>
          </div>

          {/* Micro Trust Points */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>No Credit Card for Free Tracks</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Verifiable Digital Certificates</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Direct Community Mentorship</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
