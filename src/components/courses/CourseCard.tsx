import React from 'react';
import { Course } from '../../types/index.ts';
import {
  Clock,
  PlayCircle,
  Star,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
  isEnrolled?: boolean;
  searchQuery?: string;
}

const highlightMatches = (text: string, query?: string) => {
  if (!query || !query.trim()) return text;
  const words = query
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (words.length === 0) return text;

  const regex = new RegExp(`(${words.join('|')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        className="bg-amber-400/30 text-amber-200 font-semibold px-0.5 rounded border border-amber-400/40"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
};

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onSelect,
  isEnrolled = false,
  searchQuery,
}) => {
  return (
    <div
      onClick={() => onSelect(course)}
      className="group relative flex flex-col justify-between rounded-2xl bg-[#0f1c3d]/80 border border-white/10 hover:border-amber-400/40 hover:shadow-2xl hover:shadow-blue-900/30 transition-all duration-300 overflow-hidden cursor-pointer hover:-translate-y-1"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1c3d] via-transparent to-transparent opacity-80" />

        {/* Free or Paid Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.isFree ? (
            <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-lg bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 flex items-center gap-1">
              <span>FREE</span>
              <span className="text-[9px] opacity-80 font-normal">PKR 0</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/30">
              PAID PRO
            </span>
          )}

          <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-lg bg-slate-950/70 backdrop-blur-md text-slate-300 border border-white/10">
            {course.difficulty}
          </span>
        </div>

        {/* Certificate Badge */}
        {course.certificateEligible && (
          <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-950/70 backdrop-blur-md text-amber-400 border border-amber-400/30" title="Certificate Included">
            <Award className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Enrolled Status Overlay */}
        {isEnrolled && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600/90 text-white text-xs font-bold shadow-md">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Enrolled</span>
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Category Tag */}
          <div className="text-[11px] font-bold text-amber-400 tracking-wider uppercase font-['Space_Grotesk']">
            {course.categoryName || 'Technology'}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
            {highlightMatches(course.title, searchQuery)}
          </h3>

          {/* Excerpt */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {highlightMatches(course.description, searchQuery)}
          </p>
        </div>

        {/* Metrics Row */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <PlayCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>{course.lecturesCount || 6}+ Lectures</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{course.rating || '5.0'}</span>
          </div>
        </div>

        {/* Bottom Price & Action Row */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div>
            {course.isFree ? (
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-emerald-400 font-['Space_Grotesk']">
                  PKR 0
                </span>
                <span className="text-[10px] text-slate-400">Free Access</span>
              </div>
            ) : (
              <div className="flex flex-col leading-none">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-white font-['Space_Grotesk']">
                    PKR {(course.discountedPrice || course.price).toLocaleString()}
                  </span>
                  {course.discountedPrice && course.discountedPrice < course.price && (
                    <span className="text-xs text-slate-500 line-through">
                      PKR {course.price.toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-amber-400/90 font-medium mt-0.5">
                  Full Lifetime Access
                </span>
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(course);
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-white/5 hover:bg-amber-400 hover:text-slate-950 text-slate-200 border border-white/10 hover:border-amber-400 transition-all group/btn"
          >
            <span>{isEnrolled ? 'Open Player' : 'Details'}</span>
            <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
