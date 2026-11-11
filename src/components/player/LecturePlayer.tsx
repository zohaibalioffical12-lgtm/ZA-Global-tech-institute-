import React, { useState, useEffect } from 'react';
import { Course, CourseModuleWithLessons, Lesson, Enrollment, Quiz, Assignment } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  FileText,
  Download,
  BookOpen,
  Lock,
  PlayCircle,
  HelpCircle,
  Award,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LecturePlayerProps {
  courseId: number;
  onBack: () => void;
  onOpenCertificate?: (courseId: number) => void;
}

export const LecturePlayer: React.FC<LecturePlayerProps> = ({
  courseId,
  onBack,
  onOpenCertificate,
}) => {
  const { currentUser } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [curriculum, setCurriculum] = useState<CourseModuleWithLessons[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeModuleTitle, setActiveModuleTitle] = useState<string>('');
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'quiz' | 'assignment'>('overview');

  // Quizzes & Assignments for this course
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  // Load Curriculum & Course Info
  const loadCourseData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/courses/${courseId}/curriculum?userId=${currentUser?.id || ''}&userRole=${currentUser?.role || ''}`
      );
      if (res.ok) {
        const data = await res.json();
        setCourse(data.course);
        setCurriculum(data.curriculum);
        setIsAuthorized(data.isAuthorized);

        // Find first lesson to play
        if (data.curriculum?.length > 0 && !activeLesson) {
          const firstMod = data.curriculum[0];
          if (firstMod.lessons?.length > 0) {
            setActiveLesson(firstMod.lessons[0]);
            setActiveModuleTitle(firstMod.title);
          }
        }
      }

      // Load user enrollment state
      if (currentUser?.id) {
        const enrollRes = await fetch(`/api/user/${currentUser.id}/enrollments`);
        if (enrollRes.ok) {
          const enrollList: Enrollment[] = await enrollRes.json();
          const match = enrollList.find((e) => e.courseId === courseId);
          if (match) {
            setEnrollment(match);
            try {
              setCompletedLessonIds(JSON.parse(match.completedLessons || '[]'));
            } catch {
              setCompletedLessonIds([]);
            }
          }
        }
      }

      // Load assignments
      const assignRes = await fetch(`/api/assignments/${courseId}`);
      if (assignRes.ok) {
        const aData = await assignRes.json();
        setAssignments(aData);
      }
    } catch (err) {
      console.error('Error loading lecture player:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseData();
  }, [courseId, currentUser]);

  // Extract clean YouTube embed ID from standard or unlisted URLs
  const getYouTubeEmbedUrl = (url?: string | null) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0];
    } else {
      videoId = url;
    }
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`;
  };

  // Find all lessons flattened for sequence navigation
  const allLessons: { lesson: Lesson; moduleTitle: string }[] = [];
  curriculum.forEach((mod) => {
    mod.lessons.forEach((les) => {
      allLessons.push({ lesson: les, moduleTitle: mod.title });
    });
  });

  const currentIndex = allLessons.findIndex((item) => item.lesson.id === activeLesson?.id);
  const prevLessonItem = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLessonItem = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Mark Lesson as Completed
  const handleMarkCompleted = async () => {
    if (!currentUser || !activeLesson) return;

    try {
      const res = await fetch('/api/enroll/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          courseId,
          lessonId: activeLesson.id,
        }),
      });

      if (res.ok) {
        const updatedEnrollment: Enrollment = await res.json();
        setEnrollment(updatedEnrollment);
        try {
          const list = JSON.parse(updatedEnrollment.completedLessons || '[]');
          setCompletedLessonIds(list);
        } catch {
          // ignore
        }

        // Celebrate if 100% completed
        if (updatedEnrollment.progressPercent >= 100) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }

        // Auto move to next lesson if available
        if (nextLessonItem) {
          setActiveLesson(nextLessonItem.lesson);
          setActiveModuleTitle(nextLessonItem.moduleTitle);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isCurrentCompleted = activeLesson ? completedLessonIds.includes(activeLesson.id) : false;

  let parsedPdfs: { title: string; url: string }[] = [];
  try {
    parsedPdfs = activeLesson?.pdfResources ? JSON.parse(activeLesson.pdfResources) : [];
  } catch {
    parsedPdfs = [];
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070d1e] flex flex-col items-center justify-center text-slate-400 space-y-3">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold">Loading secure lecture player...</p>
      </div>
    );
  }

  const embedSrc = getYouTubeEmbedUrl(activeLesson?.youtubeUrl);

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-200 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-16 px-4 sm:px-6 bg-[#0b152d] border-b border-white/10 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:text-white hover:border-amber-400 text-slate-400 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Courses</span>
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white font-['Space_Grotesk'] line-clamp-1 max-w-md">
              {course?.title}
            </h1>
            <p className="text-[11px] text-amber-400 font-medium">
              {activeModuleTitle}
            </p>
          </div>
        </div>

        {/* Progress & Certificate indicator */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Course Progress
            </span>
            <div className="flex items-center gap-2">
              <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${enrollment?.progressPercent || 0}%` }}
                />
              </div>
              <span className="text-xs font-bold font-mono text-emerald-400">
                {enrollment?.progressPercent || 0}%
              </span>
            </div>
          </div>

          {enrollment?.progressPercent && enrollment.progressPercent >= 100 && (
            <button
              onClick={() => onOpenCertificate && onOpenCertificate(courseId)}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Award className="w-4 h-4" />
              <span>View Certificate</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Player & Curriculum Split View */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Video Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col space-y-6">
          {/* Responsive 16:9 Video Player Container */}
          <div className="relative w-full aspect-video rounded-2xl bg-black overflow-hidden shadow-2xl border border-white/10 group">
            {activeLesson?.isLocked ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-b from-slate-950 via-slate-900 to-[#0b152d]">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                    Protected Lecture Content
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    This lecture is part of the certified course curriculum. Please complete enrollment to unlock full access to all video lectures.
                  </p>
                </div>
              </div>
            ) : embedSrc ? (
              <iframe
                src={embedSrc}
                title={activeLesson?.title || 'YouTube Lecture'}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 space-y-2">
                <PlayCircle className="w-12 h-12 text-slate-600" />
                <p className="text-xs">Select a lecture to start streaming</p>
              </div>
            )}
          </div>

          {/* Player Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#0f1c3d]/90 border border-white/10">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Current Lecture
              </span>
              <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
                {activeLesson?.title || 'Lecture Title'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={!prevLessonItem}
                onClick={() => {
                  if (prevLessonItem) {
                    setActiveLesson(prevLessonItem.lesson);
                    setActiveModuleTitle(prevLessonItem.moduleTitle);
                  }
                }}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <button
                onClick={handleMarkCompleted}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                  isCurrentCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black hover:from-amber-300 hover:to-amber-400'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCurrentCompleted ? 'Completed ✓' : 'Mark as Completed'}</span>
              </button>

              <button
                disabled={!nextLessonItem}
                onClick={() => {
                  if (nextLessonItem) {
                    setActiveLesson(nextLessonItem.lesson);
                    setActiveModuleTitle(nextLessonItem.moduleTitle);
                  }
                }}
                className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Details & Resources Tabs */}
          <div className="space-y-4">
            <div className="flex border-b border-white/10 gap-6 text-sm">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 font-semibold transition-colors border-b-2 ${
                  activeTab === 'overview'
                    ? 'text-amber-400 border-amber-400'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                Lecture Notes & Summary
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`pb-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'resources'
                    ? 'text-amber-400 border-amber-400'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                <span>Downloadable Materials</span>
                {parsedPdfs.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400/20 text-amber-300 font-mono">
                    {parsedPdfs.length}
                  </span>
                )}
              </button>
              {assignments.length > 0 && (
                <button
                  onClick={() => setActiveTab('assignment')}
                  className={`pb-3 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
                    activeTab === 'assignment'
                      ? 'text-amber-400 border-amber-400'
                      : 'text-slate-400 border-transparent hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Assignments</span>
                </button>
              )}
            </div>

            {activeTab === 'overview' && (
              <div className="p-6 rounded-2xl bg-[#0b152d] border border-white/5 space-y-4 text-xs leading-relaxed text-slate-300">
                <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                  About this Lecture
                </h3>
                <p>
                  {activeLesson?.description ||
                    'In this lesson, you will master practical implementation details with step-by-step guidance from the instructor. Take thorough notes and apply the concepts in hands-on exercises.'}
                </p>

                <div className="pt-4 border-t border-white/5 flex flex-wrap gap-4 text-slate-400">
                  <div>
                    <span className="font-semibold text-white">Estimated Runtime:</span> {activeLesson?.duration || '15 mins'}
                  </div>
                  <div>
                    <span className="font-semibold text-white">Prerequisites:</span> Completed previous module lessons
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  <span className="text-amber-400 font-semibold block mb-0.5">Video Delivery Information:</span>
                  Official lectures are hosted as high-definition Unlisted YouTube video lessons within the ZA GLOBAL TECH INSTITUTE portal. As per standard video hosting architecture, anyone in possession of an unlisted link may view the video on YouTube. Course completion tracking, assignment submissions, quiz evaluations, and official certificate issuance are strictly tied to your authenticated student account.
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="p-6 rounded-2xl bg-[#0b152d] border border-white/5 space-y-3">
                <h3 className="text-sm font-bold text-white font-['Space_Grotesk'] mb-2">
                  Lesson Slides & Source Code Attachments
                </h3>
                {parsedPdfs.length > 0 ? (
                  <div className="space-y-2">
                    {parsedPdfs.map((res, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between text-xs hover:border-amber-400/40 transition-colors"
                      >
                        <div className="flex items-center gap-2 text-slate-200">
                          <FileText className="w-4 h-4 text-amber-400" />
                          <span className="font-medium">{res.title}</span>
                        </div>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    No downloadable attachments are required for this specific lecture.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'assignment' && (
              <div className="p-6 rounded-2xl bg-[#0b152d] border border-white/5 space-y-4">
                <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                  Course Assignment
                </h3>
                {assignments.map((asg) => (
                  <div key={asg.id} className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-amber-300">{asg.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">Max Marks: {asg.totalMarks}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{asg.instructions}</p>
                    <div className="text-[11px] text-slate-400 pt-2 border-t border-white/5 flex justify-between">
                      <span>Deadline: {asg.deadline}</span>
                      <span className="text-blue-400 font-medium">Submit via Student Dashboard</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Course Curriculum Schedule */}
        <aside className="w-full lg:w-96 bg-[#0b152d] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col shrink-0">
          <div className="p-4 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-['Space_Grotesk']">
              Course Syllabus
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {completedLessonIds.length} / {allLessons.length} Done
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-2 space-y-2">
            {curriculum.map((mod) => (
              <div key={mod.id} className="rounded-xl overflow-hidden bg-slate-900/40">
                <div className="p-3 bg-slate-800/40 text-xs font-bold text-slate-200 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="line-clamp-1">{mod.title}</span>
                </div>

                <div className="py-1">
                  {mod.lessons.map((les) => {
                    const isSelected = activeLesson?.id === les.id;
                    const isCompleted = completedLessonIds.includes(les.id);

                    return (
                      <button
                        key={les.id}
                        onClick={() => {
                          setActiveLesson(les);
                          setActiveModuleTitle(mod.title);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-all rounded-lg ${
                          isSelected
                            ? 'bg-amber-400/15 text-amber-300 font-bold border-l-2 border-amber-400'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : les.isLocked ? (
                            <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          ) : (
                            <PlayCircle className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                          )}
                          <span className="truncate">{les.title}</span>
                        </div>

                        <span className="text-[10px] text-slate-500 font-mono shrink-0">
                          {les.duration || '15m'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
