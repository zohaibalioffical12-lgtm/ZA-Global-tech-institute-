import React, { useState, useEffect } from 'react';
import { Course, CourseModuleWithLessons, CourseResource } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  X,
  Clock,
  PlayCircle,
  Star,
  Award,
  CheckCircle2,
  BookOpen,
  ShieldCheck,
  Lock,
  ArrowRight,
  Globe,
  UserCheck,
  Download,
  FileText,
} from 'lucide-react';

interface CourseDetailsModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onEnrollFree: (courseId: number) => void;
  onProceedToPayment: (course: Course) => void;
  onOpenPlayer: (course: Course) => void;
  isEnrolled: boolean;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  isOpen,
  onClose,
  onEnrollFree,
  onProceedToPayment,
  onOpenPlayer,
  isEnrolled,
}) => {
  const { currentUser, signInWithGoogle } = useAuth();
  const [curriculum, setCurriculum] = useState<CourseModuleWithLessons[]>([]);
  const [loadingCurriculum, setLoadingCurriculum] = useState(false);
  const [resources, setResources] = useState<CourseResource[]>([]);

  useEffect(() => {
    if (isOpen && course.id) {
      setLoadingCurriculum(true);
      Promise.all([
        fetch(`/api/courses/${course.id}/curriculum?userId=${currentUser?.id || ''}&userRole=${currentUser?.role || ''}`).then((r) => r.json()),
        fetch(`/api/courses/${course.id}/resources`).then((r) => r.json()),
      ])
        .then(([currData, resData]) => {
          if (currData?.curriculum) setCurriculum(currData.curriculum);
          if (Array.isArray(resData)) setResources(resData);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoadingCurriculum(false));
    }
  }, [isOpen, course.id, currentUser]);

  if (!isOpen) return null;

  let objectives: string[] = [];
  try {
    objectives = course.learningObjectives ? JSON.parse(course.learningObjectives) : [];
  } catch {
    objectives = [];
  }

  const handleAction = () => {
    if (!currentUser) {
      signInWithGoogle();
      return;
    }

    if (isEnrolled) {
      onClose();
      onOpenPlayer(course);
      return;
    }

    if (course.isFree) {
      onEnrollFree(course.id);
    } else {
      onProceedToPayment(course);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0b152d] border border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Banner */}
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-slate-950">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b152d] via-[#0b152d]/60 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-md text-xs font-extrabold uppercase bg-amber-400 text-slate-950">
                {course.categoryName || 'Tech Domain'}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900/80 text-slate-200 border border-white/10">
                {course.difficulty} Level
              </span>
              {course.isFree ? (
                <span className="px-2.5 py-1 rounded-md text-xs font-extrabold uppercase bg-emerald-500 text-slate-950">
                  100% Free • PKR 0
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-md text-xs font-extrabold uppercase bg-blue-600 text-white">
                  Paid Certification
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] leading-tight">
              {course.title}
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900/70 border border-white/5 text-xs">
            <div>
              <span className="text-slate-400 block">Duration</span>
              <span className="font-bold text-white text-sm flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-amber-400" />
                {course.duration}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Curriculum</span>
              <span className="font-bold text-white text-sm flex items-center gap-1.5 mt-0.5">
                <PlayCircle className="w-4 h-4 text-blue-400" />
                {course.lecturesCount || 6}+ Lectures
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Language</span>
              <span className="font-bold text-white text-sm flex items-center gap-1.5 mt-0.5">
                <Globe className="w-4 h-4 text-indigo-400" />
                {course.language || 'Urdu / English'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Certificate</span>
              <span className="font-bold text-white text-sm flex items-center gap-1.5 mt-0.5">
                <Award className="w-4 h-4 text-emerald-400" />
                {course.certificateEligible ? 'Verified QR' : 'None'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] mb-2">
              Course Overview
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Learning Objectives */}
          {objectives.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white font-['Space_Grotesk'] mb-3">
                What You Will Learn
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {objectives.map((obj, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-white/5 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Syllabus / Modules Outline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                Curriculum & YouTube Lecture Schedule
              </h3>
              <span className="text-xs text-slate-400">
                {curriculum.length} Modules Total
              </span>
            </div>

            {loadingCurriculum ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Loading curriculum modules...
              </div>
            ) : curriculum.length > 0 ? (
              <div className="space-y-3">
                {curriculum.map((mod) => (
                  <div
                    key={mod.id}
                    className="rounded-xl bg-slate-900/60 border border-white/10 overflow-hidden"
                  >
                    <div className="px-4 py-3 bg-slate-800/40 border-b border-white/5 flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        {mod.title}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {mod.lessons.length} Lectures
                      </span>
                    </div>

                    <div className="divide-y divide-white/5">
                      {mod.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="px-4 py-2.5 flex items-center justify-between text-xs hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            {lesson.isPreview || isEnrolled ? (
                              <PlayCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                            )}
                            <span className="text-slate-300 font-medium">
                              {lesson.title}
                            </span>
                            {lesson.isPreview && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300">
                                Free Preview
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {lesson.duration || '15 mins'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/40 text-xs text-slate-400 text-center">
                Detailed lecture modules are actively updated by the instructor.
              </div>
            )}
          </div>

          {/* Templates and Learning Resources (Section 8 Requirement) */}
          {resources.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['Space_Grotesk'] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Templates & Course Resources ({resources.length})</span>
                </h3>
                <span className="text-[11px] text-cyan-400 font-semibold">
                  {isEnrolled ? 'Unlocked' : 'Included with Enrollment'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 uppercase">
                          {res.fileType}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{res.fileSize}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate mt-1">{res.title}</h4>
                      {res.description && (
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{res.description}</p>
                      )}
                    </div>

                    {isEnrolled || !res.isProtected ? (
                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shrink-0 shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Get</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-950 px-2 py-1 rounded border border-white/5 shrink-0">
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>Enroll to Unlock</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructor Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-white/10 flex flex-col sm:flex-row items-center gap-4">
            <img
              src={course.instructor?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={course.instructor?.fullName || 'Faculty'}
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-400/50 shadow-md"
            />
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Lead Instructor
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-semibold">
                  Verified Faculty
                </span>
              </div>
              <h4 className="text-base font-bold text-white">
                {course.instructor?.fullName || 'Zohaib Ali'}
              </h4>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                {course.instructor?.bio || 'Director of technology curriculum and founder at ZA Global Tech Institute.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer / Price & Enrollment CTA */}
        <div className="p-6 bg-[#070d1e] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            {isEnrolled ? (
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>You are already enrolled in this course</span>
              </div>
            ) : course.isFree ? (
              <div>
                <span className="text-2xl font-black text-emerald-400 font-['Space_Grotesk']">
                  PKR 0
                </span>
                <span className="text-xs text-slate-400 ml-2 font-medium">
                  Free Student Enrollment (No payment needed)
                </span>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white font-['Space_Grotesk']">
                    PKR {(course.discountedPrice || course.price).toLocaleString()}
                  </span>
                  {course.discountedPrice && course.discountedPrice < course.price && (
                    <span className="text-sm text-slate-500 line-through">
                      PKR {course.price.toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="text-xs text-amber-400">
                  Includes full lecture access, assignments & verified certificate
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>

            <button
              onClick={handleAction}
              className={`flex-1 sm:flex-none px-7 py-3 rounded-xl text-xs font-bold transition-all shadow-xl flex items-center justify-center gap-2 ${
                isEnrolled
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                  : course.isFree
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 shadow-emerald-500/25 font-black'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/25 font-black'
              }`}
            >
              {isEnrolled ? (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Resume Learning</span>
                </>
              ) : !currentUser ? (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Sign In to Enroll</span>
                </>
              ) : course.isFree ? (
                <>
                  <span>Enroll for Free (PKR 0)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Proceed to Enrollment & Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
