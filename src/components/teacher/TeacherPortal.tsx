import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Course, CourseModuleWithLessons, Submission, CourseResource } from '../../types/index.ts';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal.tsx';
import {
  GraduationCap,
  BookOpen,
  Plus,
  PlayCircle,
  FileText,
  CheckCircle2,
  Users,
  Award,
  Clock,
  Sparkles,
  Download,
  Trash2,
  FolderArchive,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';

export const TeacherPortal: React.FC = () => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [curriculum, setCurriculum] = useState<CourseModuleWithLessons[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'submissions' | 'resources'>('curriculum');
  const [loading, setLoading] = useState(true);

  // Notification Toast State
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // Safe In-App Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    title: string;
    itemName: string;
    itemType: string;
    warningMessage: string;
    isDeleting: boolean;
    onConfirmDelete: () => void;
  }>({
    isOpen: false,
    title: '',
    itemName: '',
    itemType: '',
    warningMessage: '',
    isDeleting: false,
    onConfirmDelete: () => {},
  });

  // New Resource Form
  const [resTitle, setResTitle] = useState('');
  const [resDesc, setResDesc] = useState('');
  const [resFileType, setResFileType] = useState('pdf');
  const [resFileUrl, setResFileUrl] = useState('');
  const [resFileSize, setResFileSize] = useState('2.5 MB');
  const [resIsProtected, setResIsProtected] = useState(true);
  const [showAddRes, setShowAddRes] = useState(false);

  // New Module Form
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');
  const [showAddModule, setShowAddModule] = useState(false);

  // New Lesson Form
  const [targetModuleId, setTargetModuleId] = useState<number | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonYoutubeUrl, setNewLessonYoutubeUrl] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState('20 mins');
  const [newLessonDesc, setNewLessonDesc] = useState('');
  const [newLessonPdfUrl, setNewLessonPdfUrl] = useState('');
  const [newLessonIsPreview, setNewLessonIsPreview] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);

  // Grading Form State
  const [gradingSubmissionId, setGradingSubmissionId] = useState<number | null>(null);
  const [gradeMarks, setGradeMarks] = useState<number>(85);
  const [gradeFeedback, setGradeFeedback] = useState<string>('Excellent technical execution and clean code structure.');

  const loadData = async () => {
    try {
      setLoading(true);
      const [coursesRes, subsRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/submissions/teacher'),
      ]);
      const cData = await coursesRes.json();
      const sData = await subsRes.json();

      if (Array.isArray(cData)) {
        setCourses(cData);
        if (cData.length > 0 && !selectedCourse) {
          setSelectedCourse(cData[0]);
        }
      }
      if (Array.isArray(sData)) {
        setSubmissions(sData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCourse?.id) {
      fetch(`/api/courses/${selectedCourse.id}/curriculum?userRole=teacher`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.curriculum) setCurriculum(data.curriculum);
        })
        .catch((err) => console.error(err));

      fetch(`/api/courses/${selectedCourse.id}/resources`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setResources(data);
        })
        .catch((err) => console.error(err));
    }
  }, [selectedCourse]);

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !resTitle.trim() || !resFileUrl.trim()) return;

    try {
      const res = await fetch(`/api/courses/${selectedCourse.id}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: resTitle.trim(),
          description: resDesc.trim(),
          fileType: resFileType,
          fileUrl: resFileUrl.trim(),
          fileSize: resFileSize.trim(),
          isProtected: resIsProtected,
        }),
      });

      if (res.ok) {
        setResTitle('');
        setResDesc('');
        setResFileUrl('');
        setShowAddRes(false);
        showNotification('Resource / learning template uploaded successfully!');
        const rRes = await fetch(`/api/courses/${selectedCourse.id}/resources`);
        const rData = await rRes.json();
        if (Array.isArray(rData)) setResources(rData);
      } else {
        const err = await res.json().catch(() => ({}));
        showNotification(err.error || 'Failed to upload resource', 'error');
      }
    } catch {
      showNotification('Failed to upload resource', 'error');
    }
  };

  const handleDeleteResource = (id: number, title: string) => {
    setDeleteModal({
      isOpen: true,
      title: 'Remove Learning Template',
      itemName: title,
      itemType: 'Resource File',
      warningMessage: 'This will remove the downloadable resource file from the course. Enrolled students will no longer see this file.',
      isDeleting: false,
      onConfirmDelete: async () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
        try {
          const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' });
          if (res.ok && selectedCourse) {
            showNotification('Resource removed successfully.');
            const rRes = await fetch(`/api/courses/${selectedCourse.id}/resources`);
            const rData = await rRes.json();
            if (Array.isArray(rData)) setResources(rData);
          } else {
            showNotification('Failed to delete resource', 'error');
          }
        } catch {
          showNotification('Network error deleting resource', 'error');
        } finally {
          setDeleteModal((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
    });
  };

  const handleDeleteModule = (moduleId: number, title: string) => {
    if (!selectedCourse) return;
    setDeleteModal({
      isOpen: true,
      title: 'Delete Curriculum Module',
      itemName: title,
      itemType: 'Module',
      warningMessage: 'Deleting this module will also remove all lectures, assignments, and resources assigned to it. This action cannot be undone.',
      isDeleting: false,
      onConfirmDelete: async () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
        try {
          const res = await fetch(`/api/courses/${selectedCourse.id}/modules/${moduleId}`, { method: 'DELETE' });
          if (res.ok) {
            showNotification(`Module "${title}" and its lectures deleted.`);
            const cRes = await fetch(`/api/courses/${selectedCourse.id}/curriculum?userRole=teacher`);
            const cData = await cRes.json();
            if (cData?.curriculum) setCurriculum(cData.curriculum);
          } else {
            const err = await res.json().catch(() => ({}));
            showNotification(err.error || 'Failed to delete module', 'error');
          }
        } catch {
          showNotification('Network error deleting module', 'error');
        } finally {
          setDeleteModal((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
    });
  };

  const handleDeleteLesson = (lessonId: number, title: string) => {
    if (!selectedCourse) return;
    setDeleteModal({
      isOpen: true,
      title: 'Delete Lecture',
      itemName: title,
      itemType: 'Lesson',
      warningMessage: 'This will remove the YouTube lecture and its attached slide resources from the course curriculum.',
      isDeleting: false,
      onConfirmDelete: async () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
        try {
          const res = await fetch(`/api/courses/${selectedCourse.id}/lessons/${lessonId}`, { method: 'DELETE' });
          if (res.ok) {
            showNotification(`Lecture "${title}" deleted.`);
            const cRes = await fetch(`/api/courses/${selectedCourse.id}/curriculum?userRole=teacher`);
            const cData = await cRes.json();
            if (cData?.curriculum) setCurriculum(cData.curriculum);
          } else {
            const err = await res.json().catch(() => ({}));
            showNotification(err.error || 'Failed to delete lecture', 'error');
          }
        } catch {
          showNotification('Network error deleting lecture', 'error');
        } finally {
          setDeleteModal((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
    });
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !newModuleTitle.trim()) return;

    try {
      const res = await fetch(`/api/courses/${selectedCourse.id}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newModuleTitle.trim(),
          description: newModuleDesc.trim(),
        }),
      });

      if (res.ok) {
        setNewModuleTitle('');
        setNewModuleDesc('');
        setShowAddModule(false);
        showNotification('New module added to curriculum!');
        // Refresh curriculum
        const cRes = await fetch(`/api/courses/${selectedCourse.id}/curriculum?userRole=teacher`);
        const cData = await cRes.json();
        if (cData?.curriculum) setCurriculum(cData.curriculum);
      } else {
        const err = await res.json().catch(() => ({}));
        showNotification(err.error || 'Failed to add module', 'error');
      }
    } catch {
      showNotification('Failed to add module', 'error');
    }
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !targetModuleId || !newLessonTitle.trim() || !newLessonYoutubeUrl.trim()) return;

    try {
      const pdfs = newLessonPdfUrl
        ? [{ title: 'Lecture Notes / Slides (PDF)', url: newLessonPdfUrl.trim() }]
        : [];

      const res = await fetch(`/api/courses/${selectedCourse.id}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: targetModuleId,
          title: newLessonTitle.trim(),
          youtubeUrl: newLessonYoutubeUrl.trim(),
          duration: newLessonDuration,
          description: newLessonDesc.trim(),
          pdfResources: JSON.stringify(pdfs),
          isPreview: newLessonIsPreview,
        }),
      });

      if (res.ok) {
        setNewLessonTitle('');
        setNewLessonYoutubeUrl('');
        setNewLessonDesc('');
        setNewLessonPdfUrl('');
        setShowAddLesson(false);
        showNotification('Lecture successfully published!');
        // Refresh curriculum
        const cRes = await fetch(`/api/courses/${selectedCourse.id}/curriculum?userRole=teacher`);
        const cData = await cRes.json();
        if (cData?.curriculum) setCurriculum(cData.curriculum);
      } else {
        const err = await res.json().catch(() => ({}));
        showNotification(err.error || 'Failed to add lecture', 'error');
      }
    } catch {
      showNotification('Failed to add lecture', 'error');
    }
  };

  const handleSaveGrade = async (subId: number) => {
    try {
      const res = await fetch(`/api/submissions/${subId}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marks: gradeMarks,
          feedback: gradeFeedback,
        }),
      });

      if (res.ok) {
        setGradingSubmissionId(null);
        showNotification('Assignment successfully graded with feedback!');
        // Reload submissions
        const subsRes = await fetch('/api/submissions/teacher');
        const sData = await subsRes.json();
        if (Array.isArray(sData)) setSubmissions(sData);
      } else {
        const err = await res.json().catch(() => ({}));
        showNotification(err.error || 'Failed to grade submission', 'error');
      }
    } catch {
      showNotification('Failed to grade submission', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in ${
            notification.type === 'error'
              ? 'bg-red-500/20 border border-red-500/40 text-red-300'
              : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Teacher Portal Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0b152d] via-blue-950/80 to-[#070d1e] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Faculty Workspace
            </div>
            <h1 className="text-2xl font-extrabold text-white font-['Space_Grotesk']">
              Teacher & Curriculum Manager
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Logged in as <span className="text-white font-bold">{currentUser?.fullName}</span>. Manage YouTube course lectures, create modules, and grade student submissions.
            </p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-slate-900 p-1.5 rounded-xl border border-white/10 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'curriculum' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Curriculum & Lectures
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'submissions' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Student Submissions</span>
            {submissions.filter((s) => s.status === 'submitted').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'resources' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Templates & Resources ({resources.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'curriculum' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course Selector Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-['Space_Grotesk']">
              Assigned Courses
            </h3>
            <div className="space-y-2">
              {courses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCourse(c)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                    selectedCourse?.id === c.id
                      ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <div className="font-semibold text-white line-clamp-1">{c.title}</div>
                  <div className="text-[10px] text-amber-400 mt-0.5">
                    {c.isFree ? 'Free Course' : `PKR ${c.price.toLocaleString()}`} • {c.difficulty}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Curriculum Editor Column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0f1c3d] border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    Managing Curriculum for
                  </span>
                  <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                    {selectedCourse?.title}
                  </h2>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddModule(true)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Module</span>
                  </button>
                </div>
              </div>

              {/* Add Module Modal/Form */}
              {showAddModule && (
                <form onSubmit={handleCreateModule} className="p-4 rounded-xl bg-slate-900 border border-blue-500/40 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase">Create New Course Module</h4>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Module Title</label>
                    <input
                      type="text"
                      required
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                      placeholder="e.g. Module 3: Advanced Deep Learning & Computer Vision"
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Description</label>
                    <input
                      type="text"
                      value={newModuleDesc}
                      onChange={(e) => setNewModuleDesc(e.target.value)}
                      placeholder="Summary of module goals..."
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowAddModule(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg"
                    >
                      Save Module
                    </button>
                  </div>
                </form>
              )}

              {/* Add YouTube Lesson Form */}
              {showAddLesson && targetModuleId && (
                <form onSubmit={handleCreateLesson} className="p-5 rounded-xl bg-slate-900 border border-amber-500/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-400 uppercase">
                      Add YouTube Unlisted Lecture to Module
                    </h4>
                    <span className="text-[10px] text-slate-400">YouTube IFrame Embed</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Lecture Title *</label>
                      <input
                        type="text"
                        required
                        value={newLessonTitle}
                        onChange={(e) => setNewLessonTitle(e.target.value)}
                        placeholder="e.g. 3.1 Convolutional Layers Explained"
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">YouTube URL (Unlisted / Public) *</label>
                      <input
                        type="text"
                        required
                        value={newLessonYoutubeUrl}
                        onChange={(e) => setNewLessonYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=XXXXXX"
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Duration (e.g. 25 mins)</label>
                      <input
                        type="text"
                        value={newLessonDuration}
                        onChange={(e) => setNewLessonDuration(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Downloadable PDF Link (Optional)</label>
                      <input
                        type="text"
                        value={newLessonPdfUrl}
                        onChange={(e) => setNewLessonPdfUrl(e.target.value)}
                        placeholder="https://example.com/slides.pdf"
                        className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Lecture Summary & Notes</label>
                    <textarea
                      rows={2}
                      value={newLessonDesc}
                      onChange={(e) => setNewLessonDesc(e.target.value)}
                      placeholder="Key concepts covered in this video..."
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="previewCheck"
                      checked={newLessonIsPreview}
                      onChange={(e) => setNewLessonIsPreview(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-700 text-amber-400"
                    />
                    <label htmlFor="previewCheck" className="text-xs text-slate-300">
                      Enable Free Preview for non-enrolled students
                    </label>
                  </div>

                  <div className="flex gap-2 justify-end pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setShowAddLesson(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-md"
                    >
                      Publish Lecture to Institute
                    </button>
                  </div>
                </form>
              )}

              {/* Curriculum List */}
              <div className="space-y-4">
                {curriculum.map((mod) => (
                  <div key={mod.id} className="rounded-xl bg-slate-900 border border-white/10 overflow-hidden">
                    <div className="p-4 bg-slate-800/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        <h4 className="text-sm font-bold text-white">{mod.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setTargetModuleId(mod.id);
                            setShowAddLesson(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center gap-1 border border-amber-400/20"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Lecture</span>
                        </button>
                        <button
                          onClick={() => handleDeleteModule(mod.id, mod.title)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                          title="Delete module"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3 divide-y divide-white/5">
                      {mod.lessons.map((les) => (
                        <div key={les.id} className="py-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <PlayCircle className="w-4 h-4 text-emerald-400" />
                            <span className="font-medium text-slate-200">{les.title}</span>
                            {les.isPreview && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-400/20 text-amber-300 font-semibold">
                                Preview
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-400 font-mono text-[11px]">{les.duration}</span>
                            <button
                              onClick={() => handleDeleteLesson(les.id, les.title)}
                              className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Delete lecture"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {mod.lessons.length === 0 && (
                        <p className="text-xs text-slate-500 py-2">No lectures added to this module yet.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submissions Review Tab */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0f1c3d] border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Student Assignment Submissions & Grading
            </h3>

            {submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-5 rounded-xl bg-slate-900 border border-white/10 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-amber-400 font-bold uppercase">
                          {sub.assignmentTitle}
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          Student: {sub.studentName} ({sub.studentEmail})
                        </h4>
                      </div>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                        sub.status === 'graded' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {sub.status === 'graded' ? `Graded (${sub.marks} / ${sub.totalMarks})` : 'Awaiting Grading'}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950 text-xs text-slate-300 border border-white/5 font-mono">
                      {sub.submissionText}
                    </div>

                    {gradingSubmissionId === sub.id ? (
                      <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/40 space-y-3">
                        <div className="flex gap-4">
                          <div className="w-32">
                            <label className="text-xs text-slate-300 block mb-1">Marks (out of {sub.totalMarks})</label>
                            <input
                              type="number"
                              min={0}
                              max={sub.totalMarks || 100}
                              value={gradeMarks}
                              onChange={(e) => setGradeMarks(Number(e.target.value))}
                              className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-white"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs text-slate-300 block mb-1">Teacher Feedback</label>
                            <input
                              type="text"
                              value={gradeFeedback}
                              onChange={(e) => setGradeFeedback(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-white"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setGradingSubmissionId(null)}
                            className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveGrade(sub.id)}
                            className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg"
                          >
                            Submit Grade & Feedback
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            setGradingSubmissionId(sub.id);
                            setGradeMarks(sub.marks || 85);
                            setGradeFeedback(sub.feedback || 'Good effort.');
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-xs font-bold transition-all"
                        >
                          {sub.status === 'graded' ? 'Update Marks / Feedback' : 'Grade Submission'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No student assignments submitted yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Templates & Resources Management Tab */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Course Selector Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-['Space_Grotesk']">
              Assigned Courses
            </h3>
            <div className="space-y-2">
              {courses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCourse(c)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                    selectedCourse?.id === c.id
                      ? 'bg-cyan-600/20 border-cyan-500 text-white font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <div className="font-semibold text-white line-clamp-1">{c.title}</div>
                  <div className="text-[10px] text-cyan-400 mt-0.5">
                    {c.isFree ? 'Free Course' : `PKR ${c.price.toLocaleString()}`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Resources Column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0f1c3d] border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                    Course Download Vault
                  </span>
                  <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                    Templates & Learning Resources — {selectedCourse?.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Provide project starters, cheat sheets, code boilerplates, and Figma kits for enrolled students.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddRes(!showAddRes)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddRes ? 'Cancel' : 'Upload / Attach Resource'}</span>
                </button>
              </div>

              {/* Upload Form */}
              {showAddRes && (
                <form
                  onSubmit={handleAddResource}
                  className="p-5 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-4"
                >
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    New Resource Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Resource Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={resTitle}
                        onChange={(e) => setResTitle(e.target.value)}
                        placeholder="e.g. Master Prompt Engineering Cheat Sheet PDF"
                        className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        File Format / Type *
                      </label>
                      <select
                        value={resFileType}
                        onChange={(e) => setResFileType(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="pdf">PDF Document</option>
                        <option value="zip">ZIP Archive / Project Files</option>
                        <option value="code">Source Code / Repo</option>
                        <option value="figma">Figma UI Kit</option>
                        <option value="worksheet">Exercise Worksheet</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        Download / Repository URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={resFileUrl}
                        onChange={(e) => setResFileUrl(e.target.value)}
                        placeholder="https://drive.google.com/... or https://github.com/..."
                        className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        File Size Label
                      </label>
                      <input
                        type="text"
                        value={resFileSize}
                        onChange={(e) => setResFileSize(e.target.value)}
                        placeholder="e.g. 2.4 MB or 18.5 MB"
                        className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Resource Description
                    </label>
                    <textarea
                      rows={2}
                      value={resDesc}
                      onChange={(e) => setResDesc(e.target.value)}
                      placeholder="Brief note on how students should use this template..."
                      className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="protectResTeacher"
                      checked={resIsProtected}
                      onChange={(e) => setResIsProtected(e.target.checked)}
                      className="w-4 h-4 rounded text-cyan-500 focus:ring-0"
                    />
                    <label htmlFor="protectResTeacher" className="text-xs text-slate-300 font-medium">
                      Require Course Enrollment to Download (Protected Resource)
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddRes(false)}
                      className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
                    >
                      Publish Resource
                    </button>
                  </div>
                </form>
              )}

              {/* Resource List */}
              {resources.length > 0 ? (
                <div className="space-y-3">
                  {resources.map((res) => (
                    <div
                      key={res.id}
                      className="p-4 rounded-xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                          <FolderArchive className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-white">{res.title}</span>
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              {res.fileType}
                            </span>
                            {res.fileSize && (
                              <span className="text-[10px] text-slate-400">{res.fileSize}</span>
                            )}
                            {res.isProtected && (
                              <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded">
                                Enrolled Students Only
                              </span>
                            )}
                          </div>
                          {res.description && (
                            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                              {res.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <a
                          href={res.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 border border-slate-700"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Preview Link</span>
                        </a>
                        <button
                          onClick={() => handleDeleteResource(res.id, res.title)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 transition-all"
                          title="Delete resource"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-white/5 space-y-2">
                  <FolderArchive className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">
                    No learning resources or templates uploaded for this course yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* In-App Delete Confirmation Modal */}
      <DeleteConfirmationModal
        {...deleteModal}
        onCancel={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
