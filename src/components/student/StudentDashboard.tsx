import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Enrollment, Certificate, Course, Submission, CourseResource } from '../../types/index.ts';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  PlayCircle,
  FileText,
  CreditCard,
  User,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Send,
  Download,
  FolderArchive,
  Code,
  ExternalLink,
} from 'lucide-react';

interface StudentDashboardProps {
  onOpenPlayer: (course: Course) => void;
  onOpenCertificateModal: (cert: Certificate) => void;
  onBrowseCourses: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenPlayer,
  onOpenCertificateModal,
  onBrowseCourses,
}) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'learning' | 'free' | 'paid' | 'resources' | 'certificates' | 'payments' | 'support'>('learning');
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [studentResources, setStudentResources] = useState<CourseResource[]>([]);
  const [loading, setLoading] = useState(true);

  // Support ticket form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  // Assignment submission state
  const [submissionAssignmentId, setSubmissionAssignmentId] = useState<number | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [assignmentSubmittedMsg, setAssignmentSubmittedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.id) {
      setLoading(true);
      Promise.all([
        fetch(`/api/user/${currentUser.id}/enrollments`).then((res) => res.json()),
        fetch(`/api/user/${currentUser.id}/certificates`).then((res) => res.json()),
      ])
        .then(async ([enrollData, certData]) => {
          if (Array.isArray(enrollData)) {
            setEnrollments(enrollData);
            // Fetch resources for enrolled courses
            const resPromises = enrollData.map((e: any) =>
              fetch(`/api/courses/${e.courseId}/resources`).then((r) => r.json()).catch(() => [])
            );
            const allRes = await Promise.all(resPromises);
            const flattened = allRes.flat().filter(Boolean);
            setStudentResources(flattened);
          }
          if (Array.isArray(certData)) setCertificates(certData);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [currentUser]);

  const freeEnrollments = enrollments.filter((e) => e.enrollmentType === 'free');
  const paidEnrollments = enrollments.filter((e) => e.enrollmentType === 'paid');
  const completedEnrollments = enrollments.filter((e) => e.status === 'completed' || e.progressPercent >= 100);

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setTicketSubject('');
      setTicketMessage('');
    }, 4000);
  };

  const handleSubmitAssignmentWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !submissionAssignmentId || !submissionText.trim()) return;

    setSubmittingAssignment(true);
    try {
      const res = await fetch(`/api/assignments/${submissionAssignmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentUser.id,
          submissionText: submissionText.trim(),
        }),
      });
      if (res.ok) {
        setAssignmentSubmittedMsg('Assignment submitted successfully! Your instructor will review and grade it.');
        setSubmissionText('');
        setTimeout(() => {
          setSubmissionAssignmentId(null);
          setAssignmentSubmittedMsg(null);
        }, 3000);
      }
    } catch {
      setAssignmentSubmittedMsg('Failed to submit assignment. Please try again.');
    } finally {
      setSubmittingAssignment(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Hero Banner (Exact Requirement) */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0b152d] via-indigo-950/80 to-[#070d1e] border border-white/10 p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Learning Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
              Welcome to ZA Global Tech Institute.
            </h1>
            <p className="text-sm text-slate-300">
              Hello, <span className="text-amber-300 font-bold">{currentUser?.fullName}</span>! Track your course progress, watch YouTube lectures, complete assignments, and download verified certificates.
            </p>
          </div>

          <button
            onClick={onBrowseCourses}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all shrink-0 flex items-center gap-2"
          >
            <span>Explore More Courses</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Metric Counter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-xs">
          <div>
            <span className="text-slate-400 block">Total Enrolled</span>
            <span className="text-2xl font-black text-white font-['Space_Grotesk'] mt-0.5 block">
              {enrollments.length}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Free Courses</span>
            <span className="text-2xl font-black text-emerald-400 font-['Space_Grotesk'] mt-0.5 block">
              {freeEnrollments.length}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Paid Pro Courses</span>
            <span className="text-2xl font-black text-blue-400 font-['Space_Grotesk'] mt-0.5 block">
              {paidEnrollments.length}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Earned Certificates</span>
            <span className="text-2xl font-black text-amber-400 font-['Space_Grotesk'] mt-0.5 block">
              {certificates.length}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-white/10 gap-2 sm:gap-4 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('learning')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'learning'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Learning & Courses ({enrollments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('free')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'free'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Free Enrollments ({freeEnrollments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('paid')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'paid'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Paid Enrollments ({paidEnrollments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'certificates'
              ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>My Certificates ({certificates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'resources'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Templates & Resources ({studentResources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'support'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Support Center</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'learning' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
            Currently Enrolled Courses
          </h2>

          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              Loading your active learning records...
            </div>
          ) : enrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((item) => {
                const c = item.course;
                if (!c) return null;
                const percent = item.progressPercent || 0;

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-[#0f1c3d]/90 border border-white/10 overflow-hidden hover:border-amber-400/40 transition-all flex flex-col justify-between"
                  >
                    <div className="relative aspect-video w-full bg-slate-900">
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${item.enrollmentType === 'free' ? 'bg-emerald-500 text-slate-950' : 'bg-blue-600 text-white'}`}>
                          {item.enrollmentType === 'free' ? 'Free Course' : 'Paid Certified'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-sm font-bold text-white line-clamp-2">
                          {c.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                          {c.description}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-400">Completion</span>
                          <span className="text-amber-400 font-mono">{percent}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-amber-400 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-white/10">
                        <button
                          onClick={() => onOpenPlayer(c)}
                          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>{percent > 0 ? 'Continue Lecture' : 'Start Course'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-white/5 space-y-4">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No courses enrolled yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore our free courses (PKR 0) and paid certifications to begin learning today.
              </p>
              <button
                onClick={onBrowseCourses}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl"
              >
                Browse All Courses
              </button>
            </div>
          )}
        </div>
      )}

      {/* Free Enrollments Panel */}
      {activeTab === 'free' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
            Your Free Learning Enrollments (PKR 0)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeEnrollments.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl bg-[#0f1c3d] border border-emerald-500/20 space-y-3">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-500/20 text-emerald-400">
                  Free Student Track
                </span>
                <h3 className="text-sm font-bold text-white">{item.course?.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{item.course?.description}</p>
                <div className="text-xs text-emerald-400 font-bold">Progress: {item.progressPercent}%</div>
                <button
                  onClick={() => item.course && onOpenPlayer(item.course)}
                  className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Watch Lectures
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paid Enrollments Panel */}
      {activeTab === 'paid' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
            Your Paid Certified Masterclasses
          </h2>
          {paidEnrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paidEnrollments.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl bg-[#0f1c3d] border border-blue-500/20 space-y-3">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-blue-500/20 text-blue-400">
                    Verified Pro Student
                  </span>
                  <h3 className="text-sm font-bold text-white">{item.course?.title}</h3>
                  <div className="text-xs text-slate-400">Duration: {item.course?.duration}</div>
                  <button
                    onClick={() => item.course && onOpenPlayer(item.course)}
                    className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                  >
                    Open Pro Classroom
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">You have not enrolled in paid masterclasses yet.</p>
          )}
        </div>
      )}

      {/* Certificates Panel */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
            Your Digital Certificates of Completion
          </h2>

          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-6 rounded-2xl bg-gradient-to-b from-[#0f1c3d] to-[#070d1e] border-2 border-amber-400/40 shadow-xl space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-center gap-2 text-amber-400">
                    <Award className="w-6 h-6" />
                    <span className="text-xs font-bold uppercase tracking-wider font-['Space_Grotesk']">
                      Official Certificate
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                      {cert.courseTitle}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Recipient: <span className="text-white font-semibold">{cert.studentName}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Issue Date: {cert.issueDate}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Verification:</span>
                    <span className="text-amber-300 font-bold">{cert.verificationCode}</span>
                  </div>

                  <button
                    onClick={() => onOpenCertificateModal(cert)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20"
                  >
                    View & Print Certificate
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-white/5 space-y-2">
              <Award className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">
                Complete 100% of your course lectures to automatically generate your official digital certificate.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Templates & Learning Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-black uppercase tracking-wider mb-2">
                <Download className="w-3 h-3 text-cyan-400" />
                <span>Student Download Vault</span>
              </div>
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Templates, Starter Kits & Learning Resources
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Official ZA Global Tech Institute materials provided exclusively for your enrolled courses. Download cheatsheets, Figma kits, code boilerplates, and project worksheets.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-2xl font-black text-cyan-400 font-['Space_Grotesk']">
                {studentResources.length}
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Resources Available</p>
            </div>
          </div>

          {studentResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentResources.map((res) => {
                const getFormatBadge = (fmt: string) => {
                  const upper = fmt.toUpperCase();
                  if (upper === 'PDF') return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
                  if (upper === 'ZIP') return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
                  if (upper === 'FIGMA') return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
                  if (upper === 'CODE') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                  return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
                };

                return (
                  <div
                    key={res.id}
                    className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getFormatBadge(
                            res.fileType
                          )}`}
                        >
                          {res.fileType}
                        </span>
                        {res.fileSize && (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {res.fileSize}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1 mb-1">
                        {res.title}
                      </h3>

                      {res.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                          {res.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-auto">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Course #{res.courseId}
                      </span>
                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 font-bold text-xs transition-all shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-white/10">
              <FolderArchive className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">No Learning Resources Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Once you enroll in courses with downloadable project kits or cheat sheets, they will appear right here for instant access.
              </p>
              <button
                onClick={onBrowseCourses}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all"
              >
                Browse Available Courses
              </button>
            </div>
          )}
        </div>
      )}

      {/* Support Center Panel */}
      {activeTab === 'support' && (
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-2xl bg-[#0f1c3d] border border-white/10 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
              Institute Student Support Center
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Have a question about course access, assignment submission, or certificate verification? Submit a ticket directly to the administration.
            </p>
          </div>

          {ticketSent ? (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Support ticket submitted! An administrator will reply to your registered email shortly.</span>
            </div>
          ) : (
            <form onSubmit={handleSendTicket} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Question regarding Lecture 2.1 in Web Dev"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Message Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Describe your issue or inquiry thoroughly..."
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <Send className="w-4 h-4" />
                <span>Submit Ticket</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
