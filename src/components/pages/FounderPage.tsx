import React from 'react';
import { SiteSettings, Course } from '../../types/index.ts';
import { CourseCard } from '../courses/CourseCard.tsx';
import {
  Sparkles,
  Award,
  CheckCircle2,
  Briefcase,
  Globe,
  ShieldCheck,
  Quote,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface FounderPageProps {
  settings?: SiteSettings | null;
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  enrolledCourseIds?: number[];
  onExploreAllCourses?: () => void;
}

export const FounderPage: React.FC<FounderPageProps> = ({
  settings,
  courses,
  onSelectCourse,
  enrolledCourseIds = [],
  onExploreAllCourses,
}) => {
  const defaultImage = 'https://i.ibb.co/s90MnLBZ/ZA-Global-Tech-Institute-Founder-portrait.png';
  const founderImage = settings?.founder_image || defaultImage;
  const founderName = settings?.founder_name || 'Zohaib Ali';
  const founderTitle = settings?.founder_title || 'Founder & CEO';
  const founderBio = settings?.founder_bio ||
    'Zohaib Ali is an accomplished technology strategist, software architect, and global educator. With a relentless focus on hands-on project deliverables, commercial viability, and AI-driven systems, he founded ZA GLOBAL TECH INSTITUTE to equip students across Pakistan and worldwide with future-proof digital competencies that unlock international careers and freelance independence.';
  const founderQuote = settings?.founder_quote ||
    'Our mission is not merely to teach code or tools, but to cultivate innovators who build tomorrow and lead the future.';

  // Courses taught by founder (instructorId 1 or matching title)
  const founderCourses = courses.filter((c) => c.instructor?.fullName?.toLowerCase().includes('zohaib') || c.id === 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 space-y-20">
      {/* Hero Showcase */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0d1a38] via-[#081226] to-[#030712] border-2 border-cyan-500/30 p-8 sm:p-14 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Founder Portrait Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 rounded-3xl blur-xl opacity-50" />
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-cyan-400/60 shadow-2xl">
                <img
                  src={founderImage}
                  alt={founderName}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-60" />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900 border border-cyan-400/50 shadow-xl text-center whitespace-nowrap">
                <span className="text-xs font-bold text-white font-['Space_Grotesk']">
                  {founderName} • {founderTitle}
                </span>
              </div>
            </div>
          </div>

          {/* Founder Bio Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-xs font-bold text-cyan-300 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Founder Leadership Profile</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk'] leading-tight">
              {founderName}
            </h1>
            <p className="text-lg font-bold text-cyan-400 font-['Space_Grotesk']">
              {founderTitle} — ZA GLOBAL TECH INSTITUTE
            </p>

            <div className="p-5 rounded-2xl bg-cyan-950/30 border-l-4 border-cyan-400 text-cyan-100 italic text-sm sm:text-base leading-relaxed font-['Space_Grotesk']">
              "{founderQuote}"
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {founderBio}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                <div className="text-xl font-black text-cyan-400 font-['Space_Grotesk']">10+ Years</div>
                <div className="text-xs text-slate-400 font-medium">Software Engineering</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                <div className="text-xl font-black text-amber-400 font-['Space_Grotesk']">Top Rated</div>
                <div className="text-xs text-slate-400 font-medium">Upwork & Global Retainers</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5">
                <div className="text-xl font-black text-blue-400 font-['Space_Grotesk']">10,000+</div>
                <div className="text-xs text-slate-400 font-medium">Students Mentored</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Vision & 3 Key Tenets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl bg-[#0d1a38] border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
            Global Market Relevancy
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every lecture and curriculum track is mapped directly to what international tech employers, venture startups, and freelancing clients are hiring for right now.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#0d1a38] border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
            Commercial Freelancing Blueprints
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Zohaib Ali teaches students how to pitch contracts, negotiate rates, write client proposals, and build long-term relationships that generate earnings in USD.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#0d1a38] border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
            Accessible Education For All
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Both Free (PKR 0) and Paid courses provide verified education, official digital certificates, and supportive communities for ambitious learners.
          </p>
        </div>
      </div>

      {/* Courses Mentored by Founder */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
              Courses Mentored by {founderName}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Direct masterclasses covering freelancing, artificial intelligence, and technology entrepreneurship.
            </p>
          </div>

          {onExploreAllCourses && (
            <button
              onClick={onExploreAllCourses}
              className="px-4 py-2 bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-bold text-cyan-300 rounded-xl transition-all flex items-center gap-1.5"
            >
              <span>Explore All Institute Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(founderCourses.length > 0 ? founderCourses : courses.slice(0, 3)).map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              onSelect={onSelectCourse}
              isEnrolled={enrolledCourseIds.includes(c.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
