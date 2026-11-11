import React from 'react';
import { Sparkles, Award, CheckCircle2, ArrowRight, Quote, ShieldCheck, Briefcase } from 'lucide-react';
import { SiteSettings } from '../../types/index.ts';

interface FounderSectionProps {
  settings?: SiteSettings | null;
  onExploreFounderCourses?: () => void;
  onViewFounderPage?: () => void;
}

export const FounderSection: React.FC<FounderSectionProps> = ({
  settings,
  onExploreFounderCourses,
  onViewFounderPage,
}) => {
  const defaultImage = 'https://i.ibb.co/s90MnLBZ/ZA-Global-Tech-Institute-Founder-portrait.png';
  const founderImage = settings?.founder_image || defaultImage;
  const founderName = settings?.founder_name || 'Zohaib Ali';
  const founderTitle = settings?.founder_title || 'Founder & CEO';
  const founderBio = settings?.founder_bio ||
    'Zohaib Ali is an accomplished technology strategist, software architect, and global educator. With a relentless focus on hands-on project deliverables, commercial viability, and AI-driven systems, he founded ZA GLOBAL TECH INSTITUTE to equip students across Pakistan and worldwide with future-proof digital competencies that unlock international careers and freelance independence.';
  const founderQuote = settings?.founder_quote ||
    'Our mission is not merely to teach code or tools, but to cultivate innovators who build tomorrow and lead the future.';

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-[#050b1a] via-[#081226] to-[#030712] relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-bold text-cyan-300 uppercase tracking-widest shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Institute Leadership</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
            Meet the Founder & Visionary
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Direct mentorship, commercial engineering standards, and international freelancing mastery from the founder of ZA Global Tech Institute.
          </p>
        </div>

        {/* Founder Showcase Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0d1a38]/90 via-[#0a1530]/90 to-[#060e22]/95 border-2 border-cyan-500/30 p-6 sm:p-10 lg:p-14 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Image Frame Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative group w-full max-w-sm">
                {/* Glowing Outer Halo */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 rounded-3xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500 group-hover:blur-xl" />

                {/* Main Image Frame */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-cyan-400/50 shadow-2xl">
                  <img
                    src={founderImage}
                    alt={`${founderName} - ${founderTitle}`}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060e22] via-transparent to-transparent opacity-60" />

                  {/* Floating Designation Pill */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-cyan-400/40 text-center">
                    <div className="text-xs font-extrabold uppercase tracking-widest text-cyan-300 font-['Space_Grotesk']">
                      {founderTitle}
                    </div>
                    <div className="text-[11px] font-bold text-white tracking-wider">
                      ZA GLOBAL TECH INSTITUTE
                    </div>
                  </div>
                </div>

                {/* Verified Founder Badge */}
                <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 border border-amber-300">
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>Verified Founder</span>
                </div>
              </div>
            </div>

            {/* Information & Biography Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <Award className="w-3.5 h-3.5" />
                  <span>Official Leadership Profile</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
                  {founderName}
                </h3>
                <p className="text-base font-semibold text-cyan-400 mt-1 font-['Space_Grotesk']">
                  {founderTitle} — ZA GLOBAL TECH INSTITUTE
                </p>
              </div>

              {/* Founder Quote Card */}
              <div className="p-5 rounded-2xl bg-cyan-950/20 border-l-4 border-cyan-400 border border-white/5 relative">
                <Quote className="w-8 h-8 text-cyan-400/20 absolute top-3 right-3" />
                <p className="text-sm sm:text-base text-cyan-100 italic leading-relaxed font-['Space_Grotesk']">
                  "{founderQuote}"
                </p>
                <div className="text-xs font-bold text-amber-400 mt-2">
                  — {founderName}, Founder & CEO
                </div>
              </div>

              {/* Biography */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {founderBio}
              </p>

              {/* Highlights Metric Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5">
                  <div className="text-lg font-black text-cyan-400 font-['Space_Grotesk']">
                    10,000+
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Students Mentored</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5">
                  <div className="text-lg font-black text-amber-400 font-['Space_Grotesk']">
                    100%
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Practical Delivery</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5">
                  <div className="text-lg font-black text-blue-400 font-['Space_Grotesk']">
                    Global USD
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Freelance Contracts</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {onViewFounderPage && (
                  <button
                    onClick={onViewFounderPage}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
                  >
                    <span>Read Full Founder Biography</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {onExploreFounderCourses && (
                  <button
                    onClick={onExploreFounderCourses}
                    className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-cyan-400/30 hover:border-cyan-400 text-xs font-bold transition-all flex items-center gap-2"
                  >
                    <Briefcase className="w-4 h-4 text-cyan-400" />
                    <span>View Courses by {founderName}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
