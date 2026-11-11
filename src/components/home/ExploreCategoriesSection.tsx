import React from 'react';
import { CourseCategory } from '../../types/index.ts';
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Bot,
  Terminal,
  Palette,
  Code,
  Layers,
  Briefcase,
  TrendingUp,
  Video,
  FileCode,
  BarChart3,
  ShieldCheck,
  FileSpreadsheet,
  Layout,
} from 'lucide-react';

interface ExploreCategoriesSectionProps {
  categories: CourseCategory[];
  onSelectCategory: (categoryId: number) => void;
  onExploreAll: () => void;
}

// Icon mapping helper
const getCategoryIcon = (slug: string, iconName?: string) => {
  switch (slug) {
    case 'artificial-intelligence':
      return <Cpu className="w-6 h-6 text-cyan-400" />;
    case 'ai-automation':
      return <Bot className="w-6 h-6 text-cyan-300" />;
    case 'prompt-engineering':
      return <Terminal className="w-6 h-6 text-amber-400" />;
    case 'graphic-designing':
    case 'graphic-design':
      return <Palette className="w-6 h-6 text-pink-400" />;
    case 'web-development':
      return <Code className="w-6 h-6 text-blue-400" />;
    case 'wordpress-development':
    case 'wordpress':
      return <Layers className="w-6 h-6 text-indigo-400" />;
    case 'programming':
      return <FileCode className="w-6 h-6 text-emerald-400" />;
    case 'freelancing':
      return <Briefcase className="w-6 h-6 text-amber-300" />;
    case 'digital-marketing':
      return <TrendingUp className="w-6 h-6 text-rose-400" />;
    case 'video-editing':
      return <Video className="w-6 h-6 text-purple-400" />;
    case 'ui-ux-design':
      return <Layout className="w-6 h-6 text-teal-400" />;
    case 'data-analytics':
      return <BarChart3 className="w-6 h-6 text-sky-400" />;
    case 'cybersecurity-fundamentals':
      return <ShieldCheck className="w-6 h-6 text-emerald-300" />;
    case 'office-productivity':
      return <FileSpreadsheet className="w-6 h-6 text-lime-400" />;
    default:
      return <Cpu className="w-6 h-6 text-cyan-400" />;
  }
};

export const ExploreCategoriesSection: React.FC<ExploreCategoriesSectionProps> = ({
  categories,
  onSelectCategory,
  onExploreAll,
}) => {
  return (
    <section className="py-16 sm:py-24 bg-[#030712] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-400/30 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Domain Discovery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">
              Explore Our Courses by Domain
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Select any of our 14 core technology disciplines. Each track features practical, industry-aligned curriculums designed to build your commercial portfolio.
            </p>
          </div>

          <button
            onClick={onExploreAll}
            className="self-start md:self-end px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-xs font-bold text-cyan-300 hover:text-white transition-all flex items-center gap-2 group"
          >
            <span>View Complete Catalog</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 14 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group p-5 rounded-2xl bg-[#091224] hover:bg-[#0d1a38] border border-white/5 hover:border-cyan-500/40 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/30 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-center group-hover:border-cyan-400/40 group-hover:scale-105 transition-all">
                  {getCategoryIcon(cat.slug, cat.icon)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors font-['Space_Grotesk']">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description || 'Professional, industry-standard training with practical projects.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-cyan-400 font-medium">
                <span>{cat.courseCount ? `${cat.courseCount} Courses` : 'Active Track'}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
