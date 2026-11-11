import React from 'react';
import { Course } from '../../types/index.ts';
import { CourseCard } from '../courses/CourseCard.tsx';
import { ArrowRight, Sparkles, CheckCircle2, Award } from 'lucide-react';

interface HomeCourseSectionsProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onExploreAll: () => void;
  onExploreFree: () => void;
  onExplorePaid: () => void;
  enrolledCourseIds?: number[];
}

export const HomeCourseSections: React.FC<HomeCourseSectionsProps> = ({
  courses,
  onSelectCourse,
  onExploreAll,
  onExploreFree,
  onExplorePaid,
  enrolledCourseIds = [],
}) => {
  const freeCourses = courses.filter((c) => c.isFree);
  const paidCourses = courses.filter((c) => !c.isFree);
  const popularCourses = [...courses].sort((a, b) => (b.enrollmentCount || 0) - (a.enrollmentCount || 0)).slice(0, 3);
  const newCourses = [...courses].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 3);

  return (
    <div className="space-y-24 py-16">
      {/* 1. Popular Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trending in Tech</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
              Popular Courses
            </h2>
          </div>
          <button
            onClick={onExploreAll}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
          >
            <span>View All Programs</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCourses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              onSelect={onSelectCourse}
              isEnrolled={enrolledCourseIds.includes(c.id)}
            />
          ))}
        </div>
      </section>

      {/* 2. Free Learning Opportunities Section (PKR 0) */}
      <section className="bg-gradient-to-b from-[#0b152d]/90 to-[#070d1e] py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Tuition Fee</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
                Free Learning Opportunities (PKR 0)
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                High-quality beginner tech courses accessible to every student with instant enrollment and no payment gateway required.
              </p>
            </div>
            <button
              onClick={onExploreFree}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
            >
              <span>Explore All Free Tracks</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeCourses.slice(0, 3).map((c) => (
              <CourseCard
                key={c.id}
                course={c}
                onSelect={onSelectCourse}
                isEnrolled={enrolledCourseIds.includes(c.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Paid Professional Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Career Certified</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
              Paid Professional Masterclasses
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Advanced curriculums featuring code grading, verified portfolio projects, EasyPaisa / JazzCash / Bank payment, and certified diplomas.
            </p>
          </div>
          <button
            onClick={onExplorePaid}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
          >
            <span>View All Paid Tracks</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paidCourses.slice(0, 3).map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              onSelect={onSelectCourse}
              isEnrolled={enrolledCourseIds.includes(c.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
