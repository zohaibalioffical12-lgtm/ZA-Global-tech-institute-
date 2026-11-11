import React from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Users,
  GraduationCap,
  Award,
  PlayCircle,
  ShieldCheck,
} from 'lucide-react';
import { InstituteStats } from '../../types/index.ts';

interface HeroSectionProps {
  stats: InstituteStats | null;
  onExploreCourses: () => void;
  onStartLearning: () => void;
  onWatchIntro?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  stats,
  onExploreCourses,
  onStartLearning,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-amber-500/10 blur-[130px] -z-10 rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 blur-[90px] -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Founder Crest Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/30 shadow-lg shadow-amber-500/10 text-xs text-amber-300 font-semibold tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>ZA GLOBAL TECH INSTITUTE • FOUNDED BY ZOHAIB ALI</span>
          </div>

          {/* Master Headline (Exact Requirement) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] leading-[1.1]">
            Unlock Your Potential.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Build Your Digital Future.
            </span>
          </h1>

          {/* Description (Exact Requirement) */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Learn modern technology, develop practical skills and prepare yourself for the opportunities of tomorrow.
          </p>

          {/* Tagline Ribbon */}
          <div className="text-xs sm:text-sm font-bold tracking-widest text-slate-400 uppercase font-['Space_Grotesk']">
            LEARN TODAY. BUILD TOMORROW. LEAD THE FUTURE.
          </div>

          {/* Master Action Buttons (Exact Requirement) */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onExploreCourses}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/25 transition-all duration-200 flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onStartLearning}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-white bg-blue-600/90 hover:bg-blue-600 border border-blue-400/30 hover:border-blue-300 shadow-xl shadow-blue-600/30 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              <PlayCircle className="w-4 h-4 text-blue-200" />
              <span>Start Learning</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Free & Paid PKR Options</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PlayCircle className="w-4 h-4 text-amber-400" />
              <span>HD YouTube Unlisted Curriculum</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-400" />
              <span>Verified Digital Certificates</span>
            </div>
          </div>
        </div>

        {/* Dynamic Statistics Bar from Actual Database Records */}
        <div className="mt-16 sm:mt-20 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#0f1c3d]/90 to-[#0b152d]/90 border border-white/10 shadow-2xl backdrop-blur-xl">
            {/* Stat 1: Registered Students */}
            <div className="text-center p-3 border-r border-white/5 last:border-none">
              <div className="w-10 h-10 mx-auto rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
                {stats?.totalStudents !== undefined ? stats.totalStudents.toLocaleString() : '—'}
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                Registered Students
              </div>
            </div>

            {/* Stat 2: Published Courses */}
            <div className="text-center p-3 border-r border-white/5 last:border-none">
              <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-['Space_Grotesk']">
                {stats?.totalCourses !== undefined ? stats.totalCourses.toLocaleString() : '—'}
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                Published Courses
              </div>
            </div>

            {/* Stat 3: Total Teachers */}
            <div className="text-center p-3 border-r border-white/5 last:border-none">
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
                {stats?.totalTeachers !== undefined ? stats.totalTeachers.toLocaleString() : '—'}
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                Faculty Teachers
              </div>
            </div>

            {/* Stat 4: Completed Courses */}
            <div className="text-center p-3">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-['Space_Grotesk']">
                {stats?.totalCompleted !== undefined ? stats.totalCompleted.toLocaleString() : '—'}
              </div>
              <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                Completed Courses
              </div>
            </div>
          </div>
          <p className="text-[11px] text-center text-slate-500 mt-2">
            * All counts are synchronized live from the Cloud SQL database records.
          </p>
        </div>
      </div>
    </section>
  );
};
