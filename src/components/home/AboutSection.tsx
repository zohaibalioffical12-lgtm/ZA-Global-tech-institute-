import React from 'react';
import { Logo } from '../common/Logo.tsx';
import { Award, Target, Sparkles, ShieldCheck, CheckCircle2, Globe, Heart } from 'lucide-react';
import { SiteSettings } from '../../types/index.ts';

interface AboutSectionProps {
  settings?: SiteSettings | null;
  onExploreCourses: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings, onExploreCourses }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Hero Header */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-bold text-amber-300 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About the Institute</span>
        </div>

        <h1 className="text-3xl sm:text-6xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight leading-tight">
          Pioneering Practical Technology Education for Pakistan & The World
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Founded and owned by <span className="text-amber-400 font-bold">{settings?.founder_name || 'Zohaib Ali'}</span>, ZA Global Tech Institute is dedicated to empowering students with real, commercially viable technical skills that enable them to build modern software, launch freelancing careers, and lead the technology revolution.
        </p>

        <div className="pt-2">
          <span className="inline-block px-4 py-2 rounded-xl bg-slate-900 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold tracking-widest uppercase">
            {settings?.tagline || 'LEARN TODAY. BUILD TOMORROW. LEAD THE FUTURE.'}
          </span>
        </div>
      </div>

      {/* Founder Message Card */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0b152d] via-[#0f1c3d] to-[#0b152d] border border-amber-400/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 text-center space-y-3">
            <img
              src={settings?.founder_image || "https://i.ibb.co/s90MnLBZ/ZA-Global-Tech-Institute-Founder-portrait.png"}
              alt="Zohaib Ali - Founder & Owner"
              className="w-48 h-48 mx-auto rounded-2xl object-cover object-top border-4 border-amber-400/50 shadow-2xl"
            />
            <div>
              <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Zohaib Ali
              </h3>
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                Founder & Owner
              </p>
              <p className="text-[11px] text-slate-400">
                ZA Global Tech Institute
              </p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <h4 className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk']">
              A Personal Note from the Founder
            </h4>
            <p>
              "When I founded ZA Global Tech Institute, my goal was straightforward: remove the barriers preventing passionate young learners and professionals from accessing world-class digital education. Traditional computer science curriculums often move too slowly for the fast-evolving demands of the AI era."
            </p>
            <p>
              "Here at ZA Global Tech Institute, our students learn by writing code, deploying neural pipelines, designing real UI systems in Figma, and delivering projects that international clients pay for. We offer both 100% Free educational opportunities and specialized Paid certifications to ensure no one is left behind."
            </p>
            <div className="pt-2 flex items-center gap-2 text-amber-300 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Learn Today. Build Tomorrow. Lead the Future.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl bg-[#0f1c3d] border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-400">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
            Our Mission
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            To provide accessible, high-caliber technology education in modern AI, programming, and design that converts directly into high-paying employment and remote freelance contracts.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#0f1c3d] border border-white/10 space-y-3">
          <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
            Our Vision
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            To establish Pakistan’s premier digital skills institute recognized internationally for producing forward-thinking engineers, AI practitioners, and digital entrepreneurs.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#0f1c3d] border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
            Our Values
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Integrity, technical rigor, genuine project deliverables, honest student guidance, and fair pricing without hidden costs or false promises.
          </p>
        </div>
      </div>
    </div>
  );
};
