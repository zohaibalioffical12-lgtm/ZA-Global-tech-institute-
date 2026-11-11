import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Course, InstituteStats, Payment, User, CourseCategory, SiteSettings, MediaItem, TeamMember, CourseResource } from '../../types/index.ts';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal.tsx';
import {
  ShieldAlert,
  BarChart3,
  DollarSign,
  BookOpen,
  Users,
  Video,
  CreditCard,
  Settings,
  Plus,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Archive,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
  Eye,
  Trash2,
  RefreshCw,
  Image as ImageIcon,
  UserCheck,
  FileText,
  RotateCcw,
  Upload,
  Copy,
  Check,
  ExternalLink,
  Save,
  HelpCircle,
  Edit3,
  X,
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  Mail,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface SuperAdminControlCenterProps {
  onCourseUpdated?: () => void;
  siteSettings?: SiteSettings | null;
  onRefreshSettings?: () => void;
}

export const SuperAdminControlCenter: React.FC<SuperAdminControlCenterProps> = ({
  onCourseUpdated,
  siteSettings,
  onRefreshSettings,
}) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'founder' | 'team' | 'media' | 'pricing' | 'resources' | 'youtube' | 'courses' | 'categories' | 'pages' | 'payments' | 'students' | 'community' | 'branding'
  >('overview');

  const [stats, setStats] = useState<InstituteStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [teamList, setTeamList] = useState<TeamMember[]>([]);
  const [resourcesList, setResourcesList] = useState<CourseResource[]>([]);
  const [selectedResourceCourseId, setSelectedResourceCourseId] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // In-App Notification Toast
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Safe In-App Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    title: string;
    itemName: string;
    itemType: string;
    warningMessage: string;
    statsSummary?: { label: string; value: number | string }[];
    isArchiveOptionAvailable?: boolean;
    isDeleting: boolean;
    requireTypingConfirm?: boolean;
    onConfirmArchive?: () => void;
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

  // Curriculum State for Selected YouTube Course
  const [selectedCourseCurriculum, setSelectedCourseCurriculum] = useState<any[]>([]);
  const [loadingCurriculum, setLoadingCurriculum] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);

  // Course Filter & Search
  const [courseSearch, setCourseSearch] = useState('');
  const [courseFilterMode, setCourseFilterMode] = useState<'all' | 'published' | 'archived' | 'free' | 'paid'>('all');

  // Student Filter & Search
  const [studentSearch, setStudentSearch] = useState('');

  // Community Management State (Announcements, Reviews, Tickets, Audit Logs)
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnRole, setNewAnnRole] = useState('all');
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);


  // Team Member Management State (Section 2 Requirement)
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [teamFormName, setTeamFormName] = useState('');
  const [teamFormRole, setTeamFormRole] = useState('');
  const [teamFormImage, setTeamFormImage] = useState('');
  const [teamFormBio, setTeamFormBio] = useState('');
  const [teamFormSpec, setTeamFormSpec] = useState('');
  const [teamFormOrder, setTeamFormOrder] = useState<number>(1);
  const [teamFormVisible, setTeamFormVisible] = useState(true);
  const [teamPreviewMember, setTeamPreviewMember] = useState<TeamMember | null>(null);

  // Resources State (Section 8 Requirement)
  const [newResourceTitle, setNewResourceTitle] = useState('');
  const [newResourceDesc, setNewResourceDesc] = useState('');
  const [newResourceType, setNewResourceType] = useState('PDF');
  const [newResourceUrl, setNewResourceUrl] = useState('');
  const [newResourceSize, setNewResourceSize] = useState('2.5 MB');
  const [newResourceProtected, setNewResourceProtected] = useState(true);

  // Categories State (Section 5 Requirement)
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('Sparkles');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');

  // Course Management State (Edit / Create / Delete)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseFormTitle, setCourseFormTitle] = useState('');
  const [courseFormCategoryId, setCourseFormCategoryId] = useState<number>(1);
  const [courseFormIsFree, setCourseFormIsFree] = useState(false);
  const [courseFormPrice, setCourseFormPrice] = useState(5000);
  const [courseFormDiscountedPrice, setCourseFormDiscountedPrice] = useState(3500);
  const [courseFormDifficulty, setCourseFormDifficulty] = useState<string>('Beginner');
  const [courseFormDuration, setCourseFormDuration] = useState('8 Weeks');
  const [courseFormThumbnail, setCourseFormThumbnail] = useState('');
  const [courseFormDesc, setCourseFormDesc] = useState('');
  const [courseFormOutcomes, setCourseFormOutcomes] = useState('');
  const [courseFormPrereqs, setCourseFormPrereqs] = useState('');
  const [courseFormCertEligible, setCourseFormCertEligible] = useState(true);
  const [courseFormIsPublished, setCourseFormIsPublished] = useState(true);
  const [courseSaving, setCourseSaving] = useState(false);

  // 1. FOUNDER PROFILE & IMAGE EDITOR STATE (Section 2 & 4 Requirement)
  const defaultFounderImage = 'https://i.ibb.co/s90MnLBZ/ZA-Global-Tech-Institute-Founder-portrait.png';
  const [founderImage, setFounderImage] = useState(siteSettings?.founder_image || defaultFounderImage);
  const [founderName, setFounderName] = useState(siteSettings?.founder_name || 'Zohaib Ali');
  const [founderTitle, setFounderTitle] = useState(siteSettings?.founder_title || 'Founder & CEO');
  const [founderBio, setFounderBio] = useState(
    siteSettings?.founder_bio ||
      'Zohaib Ali is an accomplished technology strategist, software architect, and global educator. With a relentless focus on hands-on project deliverables, commercial viability, and AI-driven systems, he founded ZA GLOBAL TECH INSTITUTE to equip students across Pakistan and worldwide with future-proof digital competencies that unlock international careers and freelance independence.'
  );
  const [founderQuote, setFounderQuote] = useState(
    siteSettings?.founder_quote ||
      'Our mission is not merely to teach code or tools, but to cultivate innovators who build tomorrow and lead the future.'
  );
  const [founderSaving, setFounderSaving] = useState(false);

  // 2. MEDIA LIBRARY STATE (Section 5 Requirement)
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<string>('all');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaCategory, setNewMediaCategory] = useState<'founder' | 'banners' | 'courses' | 'teachers' | 'projects' | 'logos' | 'general'>('banners');
  const [newMediaAlt, setNewMediaAlt] = useState('');
  const [showAddMediaModal, setShowAddMediaModal] = useState(false);
  const [copiedMediaId, setCopiedMediaId] = useState<string | null>(null);

  // 3. PRICING CONTROLLER STATE (Section 4 & 8 Requirement)
  const [editingPricingCourse, setEditingPricingCourse] = useState<Course | null>(null);
  const [pricingIsFree, setPricingIsFree] = useState(false);
  const [pricingPrice, setPricingPrice] = useState(0);
  const [pricingDiscount, setPricingDiscount] = useState(0);

  // 4. YOUTUBE LECTURE STATE (Section 5 & 9 Requirement)
  const [selectedYoutubeCourse, setSelectedYoutubeCourse] = useState<Course | null>(null);
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureYoutubeUrl, setLectureYoutubeUrl] = useState('');
  const [lectureDuration, setLectureDuration] = useState('20 mins');
  const [lectureDesc, setLectureDesc] = useState('');
  const [lecturePdfUrl, setLecturePdfUrl] = useState('');
  const [lectureModuleId, setLectureModuleId] = useState<number>(1);
  const [lectureIsPreview, setLectureIsPreview] = useState(false);

  // 5. NEW COURSE CREATION
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState<number>(1);
  const [newCourseDifficulty, setNewCourseDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newCourseDuration, setNewCourseDuration] = useState('8 Weeks');
  const [newCoursePrice, setNewCoursePrice] = useState(0);
  const [newCourseIsFree, setNewCourseIsFree] = useState(true);
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseThumbnail, setNewCourseThumbnail] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');

  // 6. NEW TEACHER CREATION
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherBio, setNewTeacherBio] = useState('');
  const [newTeacherPhoto, setNewTeacherPhoto] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80');

  // 7. PAGE CONTENT CMS
  const [heroHeadline, setHeroHeadline] = useState(siteSettings?.hero_headline || 'BUILD YOUR FUTURE WITH DIGITAL SKILLS.');
  const [heroDesc, setHeroDesc] = useState(siteSettings?.hero_description || 'Learn modern technology, develop practical skills and prepare yourself for the opportunities of tomorrow.');
  const [heroPrimaryBtn, setHeroPrimaryBtn] = useState(siteSettings?.hero_cta_primary || 'Explore Courses');
  const [heroSecondaryBtn, setHeroSecondaryBtn] = useState(siteSettings?.hero_cta_secondary || 'Start Learning');
  const [privacyPolicyContent, setPrivacyPolicyContent] = useState(siteSettings?.privacy_policy || '');
  const [termsContent, setTermsContent] = useState(siteSettings?.terms_conditions || '');

  // 8. BRANDING SETTINGS
  const [instituteName, setInstituteName] = useState(siteSettings?.institute_name || 'ZA GLOBAL TECH INSTITUTE');
  const [tagline, setTagline] = useState(siteSettings?.tagline || 'LEARN TODAY. BUILD TOMORROW. LEAD THE FUTURE.');
  const [officialEmail, setOfficialEmail] = useState(siteSettings?.official_email || 'info@zaglobaltech.com');
  const [officialPhone, setOfficialPhone] = useState(siteSettings?.phone_number || '+92 300 1234567');
  const [bankTitle, setBankTitle] = useState(siteSettings?.bank_title || 'ZA Global Tech Institute');
  const [bankAccount, setBankAccount] = useState(siteSettings?.bank_account || 'PK98 MEZN 0001 2345 6789 0101');
  const [easypaisaAccount, setEasypaisaAccount] = useState(siteSettings?.easypaisa_account || '0300-1234567');
  const [jazzcashAccount, setJazzcashAccount] = useState(siteSettings?.jazzcash_account || '0300-1234567');

  const loadCourseResources = async (courseId: number) => {
    try {
      setSelectedResourceCourseId(courseId);
      const res = await fetch(`/api/courses/${courseId}/resources`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setResourcesList(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadSelectedCourseCurriculum = async (courseId: number) => {
    try {
      setLoadingCurriculum(true);
      const res = await fetch(`/api/courses/${courseId}/curriculum?userRole=super_admin`);
      if (res.ok) {
        const data = await res.json();
        if (data?.curriculum) setSelectedCourseCurriculum(data.curriculum);
      }
    } catch (err) {
      console.error('Failed to load curriculum:', err);
    } finally {
      setLoadingCurriculum(false);
    }
  };

  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamFormName || !teamFormRole || !teamFormImage || !teamFormBio) {
      showNotification('Please fill in all required team member fields', 'error');
      return;
    }
    try {
      if (editingTeamMember) {
        const res = await fetch(`/api/team/${editingTeamMember.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: teamFormName,
            role: teamFormRole,
            image: teamFormImage,
            bio: teamFormBio,
            specialization: teamFormSpec,
            order: Number(teamFormOrder) || 1,
            isVisible: teamFormVisible,
          }),
        });
        if (res.ok) {
          showNotification(`Team member "${teamFormName}" updated successfully`);
          setShowAddTeamModal(false);
          setEditingTeamMember(null);
          loadAllAdminData();
        } else {
          showNotification('Failed to update team member', 'error');
        }
      } else {
        const res = await fetch('/api/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: teamFormName,
            role: teamFormRole,
            image: teamFormImage,
            bio: teamFormBio,
            specialization: teamFormSpec,
            order: Number(teamFormOrder) || teamList.length + 1,
            isVisible: teamFormVisible,
          }),
        });
        if (res.ok) {
          showNotification(`Team member "${teamFormName}" created successfully`);
          setShowAddTeamModal(false);
          loadAllAdminData();
        } else {
          showNotification('Failed to create team member', 'error');
        }
      }
    } catch {
      showNotification('Network error saving team member', 'error');
    }
  };

  const handleToggleTeamVisibility = async (member: TeamMember) => {
    try {
      const res = await fetch(`/api/team/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !member.isVisible }),
      });
      if (res.ok) {
        showNotification(`${member.name} is now ${!member.isVisible ? 'Visible' : 'Hidden'}`);
        loadAllAdminData();
      } else {
        showNotification('Failed to update visibility', 'error');
      }
    } catch {
      showNotification('Failed to update visibility', 'error');
    }
  };

  const handleDeleteTeamMember = (id: number, name: string) => {
    setDeleteModal({
      isOpen: true,
      title: 'Remove Team Member',
      itemName: name,
      itemType: 'Faculty Member',
      warningMessage: `Are you sure you want to remove the team profile for "${name}" from the public institute website?`,
      isDeleting: false,
      onConfirmDelete: async () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
        try {
          const res = await fetch(`/api/team/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showNotification(`Team member "${name}" removed`);
            loadAllAdminData();
          } else {
            showNotification('Failed to remove team member', 'error');
          }
        } catch {
          showNotification('Network error removing team member', 'error');
        } finally {
          setDeleteModal((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
    });
  };

  const handleRestoreDefaultFacultyTeam = async () => {
    setDeleteModal({
      isOpen: true,
      title: 'Restore Official Faculty Profiles',
      itemName: 'All 4 Founding Faculty Profiles',
      itemType: 'Team Profiles',
      warningMessage: 'This will ensure Zohaib Ali (Founder & CEO), Shehzade Ali (Principal Engineer), Sher Ali (Lead Instructor), and Rahmat Ali (Faculty Lead AI) profiles are present and visible on the website.',
      isDeleting: false,
      onConfirmDelete: async () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
        try {
          const defaultTeam = [
            {
              name: 'Zohaib Ali',
              role: 'Founder & CEO',
              image: 'https://i.ibb.co/s90MnLBZ/ZA-Global-Tech-Institute-Founder-portrait.png',
              bio: 'Visionary founder and technology entrepreneur leading ZA Global Tech Institute with international education standards.',
              specialization: 'Software Architecture, Cloud & Leadership',
              order: 1,
              isVisible: true,
            },
            {
              name: 'Shehzade Ali',
              role: 'Principal Engineer — Web Development',
              image: 'https://i.ibb.co/Y7PVkCsk/file-0000000022788211a0243870be1c4d08.png',
              bio: 'Specialist in high-scale distributed web architectures, modern React micro-frontends, Node.js engines, and production cloud infrastructure.',
              specialization: 'Full Stack Web Architecture',
              order: 2,
              isVisible: true,
            },
            {
              name: 'Sher Ali',
              role: 'Lead Instructor — UI/UX & Product Design',
              image: 'https://i.ibb.co/PvdjLh15/Whats-App-Image-2026-09-08-at-9-16-57-PM.jpg',
              bio: 'Expert design systems craftsman and product strategist mentoring students in design tokens, Figma prototyping, and usability engineering.',
              specialization: 'Design Systems & Product Design',
              order: 3,
              isVisible: true,
            },
            {
              name: 'Rahmat Ali',
              role: 'Faculty Lead — Artificial Intelligence',
              image: 'https://i.ibb.co/WWbYPHC5/Whats-App-Image-2026-10-30-at-10-15-55-PM.jpg',
              bio: 'Deep learning researcher and generative AI systems engineer guiding students through PyTorch, transformer fine-tuning, and LLM applications.',
              specialization: 'Machine Learning & Neural Engineering',
              order: 4,
              isVisible: true,
            },
          ];

          for (const member of defaultTeam) {
            await fetch('/api/team', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(member),
            });
          }

          showNotification('Official Faculty Profiles successfully restored!');
          loadAllAdminData();
        } catch {
          showNotification('Error restoring faculty profiles', 'error');
        } finally {
          setDeleteModal((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
    });
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResourceTitle || !newResourceUrl) {
      showNotification('Title and URL are required for the resource', 'error');
      return;
    }
    try {
      const res = await fetch(`/api/courses/${selectedResourceCourseId}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newResourceTitle,
          description: newResourceDesc,
          fileType: newResourceType,
          fileUrl: newResourceUrl,
          fileSize: newResourceSize,
          isProtected: newResourceProtected,
        }),
      });
      if (res.ok) {
        showNotification(`Resource "${newResourceTitle}" attached to course!`);
        setNewResourceTitle('');
        setNewResourceDesc('');
        setNewResourceUrl('');
        loadCourseResources(selectedResourceCourseId);
      } else {
        showNotification('Failed to add resource', 'error');
      }
    } catch {
      showNotification('Failed to add resource', 'error');
    }
  };

  const handleDeleteResource = (id: number, title?: string) => {
    setDeleteModal({
      isOpen: true,
      title: 'Remove Learning Resource',
      itemName: title || `Resource #${id}`,
      itemType: 'Course Material',
      warningMessage: 'This will remove the file or template from the course. Enrolled students will no longer be able to download it.',
      isDeleting: false,
      onConfirmDelete: async () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
        try {
          const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showNotification('Resource removed successfully');
            loadCourseResources(selectedResourceCourseId);
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

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName || !newCategorySlug) {
      showNotification('Category Name and Slug are required', 'error');
      return;
    }
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategoryName,
          slug: newCategorySlug,
          icon: newCategoryIcon,
          description: newCategoryDesc,
        }),
      });
      if (res.ok) {
        showNotification(`Category "${newCategoryName}" created!`);
        setNewCategoryName('');
        setNewCategorySlug('');
        setNewCategoryDesc('');
        loadAllAdminData();
      } else {
        showNotification('Failed to create category', 'error');
      }
    } catch {
      showNotification('Failed to create category', 'error');
    }
  };

  const handleDeleteCategory = (id: number, name: string) => {
    setDeleteModal({
      isOpen: true,
      title: 'Delete Course Category',
      itemName: name,
      itemType: 'Category',
      warningMessage: `Are you sure you want to delete category "${name}"? Existing courses in this category will display under General.`,
      isDeleting: false,
      onConfirmDelete: async () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
        try {
          const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showNotification(`Category "${name}" deleted`);
            loadAllAdminData();
          } else {
            showNotification('Failed to delete category', 'error');
          }
        } catch {
          showNotification('Network error deleting category', 'error');
        } finally {
          setDeleteModal((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
    });
  };

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, coursesRes, catsRes, paymentsRes, usersRes, settingsRes, teamRes, annRes, revRes, tickRes, logsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/courses/admin'),
        fetch('/api/categories'),
        fetch('/api/payments/admin'),
        fetch('/api/users/admin'),
        fetch('/api/settings'),
        fetch('/api/team?all=true'),
        fetch('/api/announcements?role=admin').catch(() => null),
        fetch('/api/reviews/admin').catch(() => null),
        fetch('/api/support-tickets').catch(() => null),
        fetch('/api/audit-logs').catch(() => null),
      ]);

      const sData = await statsRes.json();
      const cData = await coursesRes.json();
      const catData = await catsRes.json();
      const pData = await paymentsRes.json();
      const uData = await usersRes.json();
      const settData = await settingsRes.json();
      const tData = await teamRes.json();

      setStats(sData);
      if (Array.isArray(cData)) {
        setCourses(cData);
        if (cData.length > 0 && !selectedYoutubeCourse) {
          setSelectedYoutubeCourse(cData[0]);
          loadSelectedCourseCurriculum(cData[0].id);
        }
        if (cData.length > 0) loadCourseResources(cData[0].id);
      }
      if (Array.isArray(catData)) setCategories(catData);
      if (Array.isArray(pData)) setPayments(pData);
      if (Array.isArray(uData)) setUsersList(uData);
      if (Array.isArray(tData)) setTeamList(tData);

      if (annRes && annRes.ok) {
        const annData = await annRes.json();
        if (Array.isArray(annData)) setAnnouncements(annData);
      }
      if (revRes && revRes.ok) {
        const revData = await revRes.json();
        if (Array.isArray(revData)) setReviewsList(revData);
      }
      if (tickRes && tickRes.ok) {
        const tickData = await tickRes.json();
        if (Array.isArray(tickData)) setSupportTickets(tickData);
      }
      if (logsRes && logsRes.ok) {
        const logsData = await logsRes.json();
        if (Array.isArray(logsData)) setAuditLogs(logsData);
      }

      if (settData && !settData.error) {
        if (settData.founder_image) setFounderImage(settData.founder_image);
        if (settData.founder_name) setFounderName(settData.founder_name);
        if (settData.founder_title) setFounderTitle(settData.founder_title);
        if (settData.founder_bio) setFounderBio(settData.founder_bio);
        if (settData.founder_quote) setFounderQuote(settData.founder_quote);
        if (settData.hero_headline) setHeroHeadline(settData.hero_headline);
        if (settData.hero_description) setHeroDesc(settData.hero_description);
        if (settData.privacy_policy) setPrivacyPolicyContent(settData.privacy_policy);
        if (settData.terms_conditions) setTermsContent(settData.terms_conditions);

        if (settData.media_library) {
          try {
            setMediaList(JSON.parse(settData.media_library));
          } catch {
            setMediaList([]);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  useEffect(() => {
    if (selectedYoutubeCourse?.id) {
      loadSelectedCourseCurriculum(selectedYoutubeCourse.id);
    }
  }, [selectedYoutubeCourse?.id]);

  // SAVE FOUNDER SETTINGS & IMAGE
  const handleSaveFounder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFounderSaving(true);
    try {
      await Promise.all([
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'founder_image', value: founderImage }) }),
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'founder_name', value: founderName }) }),
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'founder_title', value: founderTitle }) }),
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'founder_bio', value: founderBio }) }),
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'founder_quote', value: founderQuote }) }),
      ]);
      showNotification('Founder profile and portrait updated successfully!');
      if (onRefreshSettings) onRefreshSettings();
    } catch {
      showNotification('Failed to save founder settings', 'error');
    } finally {
      setFounderSaving(false);
    }
  };

  // RESTORE ORIGINAL FOUNDER IMAGE (Section 2 Requirement)
  const handleRestoreOriginalFounderImage = () => {
    setDeleteModal({
      isOpen: true,
      title: 'Restore Founder Portrait',
      itemName: 'Official Portrait of Founder Zohaib Ali',
      itemType: 'Founder Media',
      warningMessage: 'This will restore the official portrait of Founder & Owner Zohaib Ali across all sections and profile cards of the website.',
      isDeleting: false,
      onConfirmDelete: async () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
        try {
          setFounderImage(defaultFounderImage);
          await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: 'founder_image', value: defaultFounderImage }),
          });
          showNotification('Original Founder portrait restored!');
          if (onRefreshSettings) onRefreshSettings();
        } catch {
          showNotification('Failed to restore founder portrait', 'error');
        } finally {
          setDeleteModal((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
    });
  };

  // SAVE MEDIA ITEM
  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaUrl.trim() || !newMediaTitle.trim()) {
      showNotification('Image Title and Image URL are required', 'error');
      return;
    }

    const newItem: MediaItem = {
      id: `media-${Date.now()}`,
      title: newMediaTitle.trim(),
      url: newMediaUrl.trim(),
      category: newMediaCategory,
      alt: newMediaAlt.trim() || newMediaTitle.trim(),
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    const updatedList = [newItem, ...mediaList];
    setMediaList(updatedList);

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'media_library', value: JSON.stringify(updatedList) }),
      });
      setShowAddMediaModal(false);
      setNewMediaTitle('');
      setNewMediaUrl('');
      setNewMediaAlt('');
      showNotification('Image added to Media Library!');
    } catch {
      showNotification('Failed to save media item', 'error');
    }
  };

  const handleDeleteMedia = (id: string, title?: string) => {
    setDeleteModal({
      isOpen: true,
      title: 'Remove Image from Media Library',
      itemName: title || id,
      itemType: 'Media Item',
      warningMessage: 'Are you sure you want to delete this image from the Media Library? Any course or page directly referencing this URL may continue displaying it.',
      isDeleting: false,
      onConfirmDelete: async () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
        try {
          const updatedList = mediaList.filter((m) => m.id !== id);
          setMediaList(updatedList);
          await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: 'media_library', value: JSON.stringify(updatedList) }),
          });
          showNotification('Image removed from library.');
        } catch {
          showNotification('Failed to remove image', 'error');
        } finally {
          setDeleteModal((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
    });
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedMediaId(id);
    showNotification('Image URL copied to clipboard!');
    setTimeout(() => setCopiedMediaId(null), 2000);
  };

  // SAVE COURSE PRICING (Critical Requirement)
  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPricingCourse) return;

    try {
      const res = await fetch(`/api/courses/${editingPricingCourse.id}/pricing`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isFree: pricingIsFree,
          price: pricingIsFree ? 0 : pricingPrice,
          discountedPrice: pricingIsFree ? 0 : pricingDiscount,
        }),
      });

      if (res.ok) {
        setEditingPricingCourse(null);
        loadAllAdminData();
        if (onCourseUpdated) onCourseUpdated();
        showNotification('Course pricing updated and enforced on backend!');
      }
    } catch {
      alert('Failed to update pricing');
    }
  };

  // COURSE CRUD HANDLERS (Create, Edit, Delete)
  const handleOpenCreateCourse = () => {
    setEditingCourse(null);
    setCourseFormTitle('');
    setCourseFormCategoryId(categories[0]?.id || 1);
    setCourseFormIsFree(false);
    setCourseFormPrice(5000);
    setCourseFormDiscountedPrice(3500);
    setCourseFormDifficulty('Beginner');
    setCourseFormDuration('8 Weeks');
    setCourseFormThumbnail('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80');
    setCourseFormDesc('');
    setCourseFormOutcomes('Understand core fundamentals\nBuild industry projects\nGain practical mastery');
    setCourseFormPrereqs('Basic computer literacy');
    setCourseFormCertEligible(true);
    setCourseFormIsPublished(true);
    setShowCourseModal(true);
  };

  const handleOpenEditCourse = (c: Course) => {
    setEditingCourse(c);
    setCourseFormTitle(c.title || '');
    setCourseFormCategoryId(c.categoryId || categories[0]?.id || 1);
    setCourseFormIsFree(Boolean(c.isFree));
    setCourseFormPrice(c.price || 0);
    setCourseFormDiscountedPrice(c.discountedPrice || 0);
    setCourseFormDifficulty(c.difficulty || 'Beginner');
    setCourseFormDuration(c.duration || '8 Weeks');
    setCourseFormThumbnail(c.thumbnail || '');
    setCourseFormDesc(c.description || '');

    let outcomesStr = '';
    if (typeof c.learningObjectives === 'string') {
      try {
        const parsed = JSON.parse(c.learningObjectives);
        outcomesStr = Array.isArray(parsed) ? parsed.join('\n') : c.learningObjectives;
      } catch {
        outcomesStr = c.learningObjectives;
      }
    }
    setCourseFormOutcomes(outcomesStr || 'Industry-relevant practical skills\nProject portfolio development');
    setCourseFormPrereqs(c.prerequisites || 'Basic computer knowledge');
    setCourseFormCertEligible(c.certificateEligible !== false);
    setCourseFormIsPublished(c.isPublished !== false);
    setShowCourseModal(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseFormTitle.trim()) {
      alert('Please enter a course title');
      return;
    }
    try {
      setCourseSaving(true);
      const outcomesArray = courseFormOutcomes
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const prereqsArray = courseFormPrereqs
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: courseFormTitle.trim(),
        categoryId: Number(courseFormCategoryId),
        isFree: courseFormIsFree,
        price: courseFormIsFree ? 0 : Number(courseFormPrice),
        discountedPrice: courseFormIsFree ? 0 : Number(courseFormDiscountedPrice),
        difficulty: courseFormDifficulty,
        duration: courseFormDuration.trim() || '8 Weeks',
        thumbnail: courseFormThumbnail.trim(),
        description: courseFormDesc.trim(),
        learningOutcomes: outcomesArray,
        prerequisites: prereqsArray,
        certificateEligible: courseFormCertEligible,
        isPublished: courseFormIsPublished,
      };

      const url = editingCourse ? `/api/courses/${editingCourse.id}` : '/api/courses';
      const method = editingCourse ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save course');
      }

      setShowCourseModal(false);
      showNotification(
        editingCourse
          ? `Course "${courseFormTitle}" updated successfully!`
          : `Course "${courseFormTitle}" created successfully!`
      );

      // Refresh courses
      const cRes = await fetch('/api/courses/admin');
      const cData = await cRes.json();
      if (Array.isArray(cData)) setCourses(cData);
      if (onCourseUpdated) onCourseUpdated();
    } catch (err: any) {
      showNotification(err.message || 'Error saving course', 'error');
    } finally {
      setCourseSaving(false);
    }
  };

  const handleDeleteCourse = async (course: Course) => {
    try {
      // 1. Fetch safety status from backend
      const sRes = await fetch(`/api/courses/${course.id}/safety`);
      const safety = await sRes.json().catch(() => ({}));

      const statsSummary = [
        { label: 'Enrolled Students', value: safety.enrollmentsCount || 0 },
        { label: 'Verified Payments', value: safety.paymentsCount || 0 },
        { label: 'Issued Certificates', value: safety.certificatesCount || 0 },
        { label: 'Curriculum Lessons', value: safety.lessonsCount || 0 },
      ];

      setDeleteModal({
        isOpen: true,
        title: 'Delete or Archive Course',
        itemName: course.title,
        itemType: 'Course Offering',
        statsSummary,
        isArchiveOptionAvailable: true,
        requireTypingConfirm: Boolean(safety.hasSensitiveHistoricalData),
        warningMessage: safety.hasSensitiveHistoricalData
          ? `This course has ${safety.certificatesCount} issued certificates and ${safety.paymentsCount} recorded payments. We strongly recommend Archiving it so student verification remains valid. Permanent deletion will remove all curriculum modules and lessons.`
          : 'This course has no linked payments or certificates. You may safely archive it or permanently delete it along with its modules and lessons.',
        isDeleting: false,
        onConfirmArchive: async () => {
          setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
          try {
            const res = await fetch(`/api/courses/${course.id}/archive`, { method: 'POST' });
            if (res.ok) {
              showNotification(`Course "${course.title}" was archived.`);
              loadAllAdminData();
              if (onCourseUpdated) onCourseUpdated();
            } else {
              showNotification('Failed to archive course', 'error');
            }
          } catch {
            showNotification('Network error archiving course', 'error');
          } finally {
            setDeleteModal((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
          }
        },
        onConfirmDelete: async () => {
          setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
          try {
            const res = await fetch(`/api/courses/${course.id}?force=true`, { method: 'DELETE' });
            if (res.ok) {
              showNotification(`Course "${course.title}" was permanently deleted.`);
              loadAllAdminData();
              if (onCourseUpdated) onCourseUpdated();
            } else {
              const err = await res.json().catch(() => ({}));
              showNotification(err.error || 'Failed to delete course', 'error');
            }
          } catch {
            showNotification('Network error deleting course', 'error');
          } finally {
            setDeleteModal((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
          }
        },
      });
    } catch {
      showNotification('Unable to verify course safety status', 'error');
    }
  };

  const handleArchiveCourse = async (course: Course) => {
    try {
      const res = await fetch(`/api/courses/${course.id}/archive`, { method: 'POST' });
      if (res.ok) {
        showNotification(`Course "${course.title}" archived successfully.`);
        loadAllAdminData();
        if (onCourseUpdated) onCourseUpdated();
      } else {
        showNotification('Failed to archive course', 'error');
      }
    } catch {
      showNotification('Network error archiving course', 'error');
    }
  };

  const handleRestoreCourse = async (courseId: number, title: string) => {
    try {
      const res = await fetch(`/api/courses/${courseId}/restore`, { method: 'POST' });
      if (res.ok) {
        showNotification(`Course "${title}" restored to active catalog!`);
        loadAllAdminData();
        if (onCourseUpdated) onCourseUpdated();
      } else {
        showNotification('Failed to restore course', 'error');
      }
    } catch {
      showNotification('Network error restoring course', 'error');
    }
  };

  // ADD YOUTUBE UNLISTED LECTURE
  const handleAddYoutubeLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYoutubeCourse || !lectureTitle.trim() || !lectureYoutubeUrl.trim()) {
      showNotification('Please select a course and enter lecture title and YouTube URL', 'error');
      return;
    }

    try {
      const pdfs = lecturePdfUrl ? [{ title: 'Resource Document', url: lecturePdfUrl }] : [];
      const res = await fetch(`/api/courses/${selectedYoutubeCourse.id}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleId: lectureModuleId || 1,
          title: lectureTitle.trim(),
          youtubeUrl: lectureYoutubeUrl.trim(),
          duration: lectureDuration,
          description: lectureDesc,
          pdfResources: JSON.stringify(pdfs),
          isPreview: lectureIsPreview,
        }),
      });

      if (res.ok) {
        setLectureTitle('');
        setLectureYoutubeUrl('');
        setLectureDesc('');
        setLecturePdfUrl('');
        showNotification(`YouTube lecture added to ${selectedYoutubeCourse.title}!`);
        loadAllAdminData();
        if (selectedYoutubeCourse) loadSelectedCourseCurriculum(selectedYoutubeCourse.id);
      } else {
        showNotification('Failed to add lecture', 'error');
      }
    } catch {
      showNotification('Failed to add lecture', 'error');
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYoutubeCourse || !newModuleTitle.trim()) {
      showNotification('Please enter a module title', 'error');
      return;
    }
    try {
      const res = await fetch(`/api/courses/${selectedYoutubeCourse.id}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newModuleTitle.trim(),
          description: newModuleDesc.trim(),
        }),
      });
      if (res.ok) {
        showNotification('Curriculum module created!');
        setNewModuleTitle('');
        setNewModuleDesc('');
        setShowAddModuleModal(false);
        loadSelectedCourseCurriculum(selectedYoutubeCourse.id);
      } else {
        showNotification('Failed to create module', 'error');
      }
    } catch {
      showNotification('Network error creating module', 'error');
    }
  };

  const handleDeleteModule = (moduleId: number, title: string) => {
    if (!selectedYoutubeCourse) return;
    setDeleteModal({
      isOpen: true,
      title: 'Delete Curriculum Module',
      itemName: title,
      itemType: 'Course Module',
      warningMessage: 'Deleting this module will also delete all YouTube lectures, slides, and learning materials within it. This action cannot be undone.',
      isDeleting: false,
      onConfirmDelete: async () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
        try {
          const res = await fetch(`/api/courses/${selectedYoutubeCourse.id}/modules/${moduleId}`, { method: 'DELETE' });
          if (res.ok) {
            showNotification(`Module "${title}" deleted.`);
            loadSelectedCourseCurriculum(selectedYoutubeCourse.id);
          } else {
            showNotification('Failed to delete module', 'error');
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
    if (!selectedYoutubeCourse) return;
    setDeleteModal({
      isOpen: true,
      title: 'Delete YouTube Lecture',
      itemName: title,
      itemType: 'Lecture Video',
      warningMessage: 'This will remove the lecture from this course curriculum.',
      isDeleting: false,
      onConfirmDelete: async () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
        try {
          const res = await fetch(`/api/courses/${selectedYoutubeCourse.id}/lessons/${lessonId}`, { method: 'DELETE' });
          if (res.ok) {
            showNotification(`Lecture "${title}" deleted.`);
            loadSelectedCourseCurriculum(selectedYoutubeCourse.id);
          } else {
            showNotification('Failed to delete lecture', 'error');
          }
        } catch {
          showNotification('Network error deleting lecture', 'error');
        } finally {
          setDeleteModal((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
    });
  };

  // VERIFY PAYMENT (APPROVE & AUTO-ENROLL)
  const handleUpdatePaymentStatus = async (paymentId: number, status: string) => {
    try {
      const res = await fetch(`/api/payments/${paymentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        loadAllAdminData();
        showNotification(`Payment marked as ${status}. Enrollment activated.`);
      } else {
        showNotification('Failed to update payment status', 'error');
      }
    } catch {
      showNotification('Failed to update payment status', 'error');
    }
  };

  // USER STATUS TOGGLE & DELETE
  const handleUpdateUserStatus = async (userId: number, status: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        loadAllAdminData();
        showNotification(`User account marked as ${status}.`);
      } else {
        showNotification('Failed to update user status', 'error');
      }
    } catch {
      showNotification('Failed to update user status', 'error');
    }
  };

  const handleDeleteUser = (userId: number, email: string) => {
    setDeleteModal({
      isOpen: true,
      title: 'Archive or Remove Student Account',
      itemName: email,
      itemType: 'Student Account',
      isArchiveOptionAvailable: true,
      warningMessage: 'Archiving/suspending this account preserves financial transaction history and issued certificate records while blocking login access. Permanent deletion is only allowed if no historical payments exist.',
      isDeleting: false,
      onConfirmArchive: async () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
        try {
          const res = await fetch(`/api/users/${userId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'suspended' }),
          });
          if (res.ok) {
            showNotification(`Student account "${email}" suspended (credentials preserved).`);
            loadAllAdminData();
          } else {
            showNotification('Failed to suspend account', 'error');
          }
        } catch {
          showNotification('Network error suspending user', 'error');
        } finally {
          setDeleteModal((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
      onConfirmDelete: async () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
        try {
          const res = await fetch(`/api/users/${userId}?soft=false`, { method: 'DELETE' });
          if (res.ok) {
            showNotification(`Student account "${email}" permanently removed.`);
            loadAllAdminData();
          } else {
            const err = await res.json().catch(() => ({}));
            showNotification(err.error || 'Failed to delete student account', 'error');
          }
        } catch {
          showNotification('Network error deleting student account', 'error');
        } finally {
          setDeleteModal((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
    });
  };

  // COMMUNITY & MESSAGES HANDLERS
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) {
      showNotification('Title and content are required', 'error');
      return;
    }
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newAnnTitle.trim(),
          content: newAnnContent.trim(),
          targetRole: newAnnRole,
        }),
      });
      if (res.ok) {
        showNotification('Announcement posted to all students and faculty!');
        setNewAnnTitle('');
        setNewAnnContent('');
        loadAllAdminData();
      } else {
        showNotification('Failed to post announcement', 'error');
      }
    } catch {
      showNotification('Network error posting announcement', 'error');
    }
  };

  const handleDeleteAnnouncement = (id: number, title: string) => {
    setDeleteModal({
      isOpen: true,
      title: 'Delete Announcement',
      itemName: title,
      itemType: 'Announcement',
      warningMessage: 'This announcement will be removed from all student and faculty portal notification centers.',
      isDeleting: false,
      onConfirmDelete: async () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
        try {
          const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showNotification('Announcement deleted.');
            loadAllAdminData();
          } else {
            showNotification('Failed to delete announcement', 'error');
          }
        } catch {
          showNotification('Network error deleting announcement', 'error');
        } finally {
          setDeleteModal((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
    });
  };

  const handleToggleReviewStatus = async (reviewId: number, isApproved: boolean) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved }),
      });
      if (res.ok) {
        showNotification(`Review status updated to ${isApproved ? 'Approved & Published' : 'Hidden'}.`);
        loadAllAdminData();
      } else {
        showNotification('Failed to update review status', 'error');
      }
    } catch {
      showNotification('Failed to update review status', 'error');
    }
  };

  const handleDeleteReview = (reviewId: number) => {
    setDeleteModal({
      isOpen: true,
      title: 'Delete Student Testimonial',
      itemName: `Review #${reviewId}`,
      itemType: 'Student Review',
      warningMessage: 'This will delete this student review from the public testimonials section.',
      isDeleting: false,
      onConfirmDelete: async () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
        try {
          const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
          if (res.ok) {
            showNotification('Review removed successfully.');
            loadAllAdminData();
          } else {
            showNotification('Failed to delete review', 'error');
          }
        } catch {
          showNotification('Network error deleting review', 'error');
        } finally {
          setDeleteModal((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
    });
  };

  const handleUpdateTicketStatus = async (ticketId: number, status: string) => {
    try {
      const res = await fetch(`/api/support-tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showNotification(`Contact ticket marked as ${status}.`);
        loadAllAdminData();
      } else {
        showNotification('Failed to update ticket status', 'error');
      }
    } catch {
      showNotification('Failed to update ticket status', 'error');
    }
  };

  const handleDeleteTicket = (ticketId: number, studentName: string) => {
    setDeleteModal({
      isOpen: true,
      title: 'Delete Contact Inquiry',
      itemName: `Inquiry from ${studentName}`,
      itemType: 'Support Message',
      warningMessage: 'This message and its student contact details will be deleted from the system.',
      isDeleting: false,
      onConfirmDelete: async () => {
        setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
        try {
          const res = await fetch(`/api/support-tickets/${ticketId}`, { method: 'DELETE' });
          if (res.ok) {
            showNotification('Contact message removed.');
            loadAllAdminData();
          } else {
            showNotification('Failed to delete contact message', 'error');
          }
        } catch {
          showNotification('Network error deleting ticket', 'error');
        } finally {
          setDeleteModal((prev) => ({ ...prev, isOpen: false, isDeleting: false }));
        }
      },
    });
  };

  // SAVE PAGE CONTENT (Hero, Privacy, Terms)
  const handleSavePageContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await Promise.all([
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'hero_headline', value: heroHeadline }) }),
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'hero_description', value: heroDesc }) }),
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'hero_cta_primary', value: heroPrimaryBtn }) }),
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'hero_cta_secondary', value: heroSecondaryBtn }) }),
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'privacy_policy', value: privacyPolicyContent }) }),
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'terms_conditions', value: termsContent }) }),
      ]);
      showNotification('Page content and legal policies published!');
      if (onRefreshSettings) onRefreshSettings();
    } catch {
      showNotification('Failed to save page content', 'error');
    }
  };

  // SAVE BRANDING
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await Promise.all([
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'institute_name', value: instituteName }) }),
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'tagline', value: tagline }) }),
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'official_email', value: officialEmail }) }),
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'phone_number', value: officialPhone }) }),
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'bank_title', value: bankTitle }) }),
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'bank_account', value: bankAccount }) }),
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'easypaisa_account', value: easypaisaAccount }) }),
        fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'jazzcash_account', value: jazzcashAccount }) }),
      ]);
      showNotification('Institute branding and accounts saved!');
      if (onRefreshSettings) onRefreshSettings();
    } catch {
      showNotification('Failed to save branding', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Super Admin Control Center Header */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0d1a38] via-[#09142b] to-[#040816] border-2 border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl shadow-cyan-950/40 relative overflow-hidden">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20 shrink-0">
            <ShieldAlert className="w-9 h-9" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[11px] font-extrabold uppercase tracking-widest text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full System Ownership & CMS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight mt-1">
              ZA GLOBAL TECH INSTITUTE — OWNER CONTROL CENTER
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Authorized Owner: <span className="text-cyan-300 font-bold">{siteSettings?.founder_name || 'Zohaib Ali'}</span>. Manage founder portraits, media library, courses, pricing, YouTube unlisted lessons, and student payment records.
            </p>
          </div>
        </div>

        <button
          onClick={loadAllAdminData}
          className="px-4 py-2.5 bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sync Database</span>
        </button>
      </div>

      {/* Floating Notification */}
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

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-white/10 gap-2 text-xs font-bold scrollbar-none">
        {[
          { id: 'overview', label: 'Overview Dashboard', icon: BarChart3 },
          { id: 'founder', label: 'Founder Profile & Portrait', icon: UserCheck },
          { id: 'team', label: 'Our Team Management', icon: Users },
          { id: 'media', label: 'Media Library', icon: ImageIcon },
          { id: 'pricing', label: 'Free/Paid Pricing Control', icon: DollarSign },
          { id: 'resources', label: 'Templates & Resources', icon: FileText },
          { id: 'youtube', label: 'YouTube Curriculum & Lectures', icon: Video },
          { id: 'courses', label: 'Course Management', icon: BookOpen },
          { id: 'categories', label: 'Categories (17)', icon: Layers },
          { id: 'pages', label: 'Page Content CMS', icon: FileText },
          { id: 'payments', label: 'Fee Payments & Approvals', icon: CreditCard },
          { id: 'students', label: 'Student Accounts', icon: Users },
          { id: 'community', label: 'Announcements & Messages', icon: MessageSquare },
          { id: 'branding', label: 'Branding & Accounts', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-400/20 font-black'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#0d1a38] border border-white/10 space-y-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Total Registered Students
              </span>
              <div className="text-3xl font-black text-white font-['Space_Grotesk']">
                {stats?.totalStudents || 0}
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">Synced from Cloud SQL</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0d1a38] border border-white/10 space-y-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Published Tech Courses
              </span>
              <div className="text-3xl font-black text-cyan-400 font-['Space_Grotesk']">
                {stats?.totalCourses || 0}
              </div>
              <span className="text-[11px] text-slate-400">Available across 14 domains</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0d1a38] border border-white/10 space-y-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Verified Gross Revenue (PKR)
              </span>
              <div className="text-3xl font-black text-emerald-400 font-['Space_Grotesk']">
                PKR {(stats?.verifiedRevenuePKR || 0).toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400">Approved fee transactions</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0d1a38] border border-white/10 space-y-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                Total Active Enrollments
              </span>
              <div className="text-3xl font-black text-blue-400 font-['Space_Grotesk']">
                {stats?.totalEnrollments || 0}
              </div>
              <span className="text-[11px] text-slate-400">Free + Paid active learners</span>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => setActiveTab('founder')}
              className="p-6 rounded-2xl bg-[#0d1a38] border border-cyan-500/20 hover:border-cyan-400 cursor-pointer transition-all space-y-2 group"
            >
              <UserCheck className="w-6 h-6 text-cyan-400" />
              <h4 className="text-base font-bold text-white group-hover:text-cyan-300">
                Founder Profile & Image Editor &rarr;
              </h4>
              <p className="text-xs text-slate-400">
                Replace, crop, preview, or restore the official portrait of Founder Zohaib Ali.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('pricing')}
              className="p-6 rounded-2xl bg-[#0d1a38] border border-amber-500/20 hover:border-amber-400 cursor-pointer transition-all space-y-2 group"
            >
              <DollarSign className="w-6 h-6 text-amber-400" />
              <h4 className="text-base font-bold text-white group-hover:text-amber-300">
                Course Pricing Controller &rarr;
              </h4>
              <p className="text-xs text-slate-400">
                Turn any course Free (PKR 0) or Paid Pro, set discounted prices, and manage coupons.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('youtube')}
              className="p-6 rounded-2xl bg-[#0d1a38] border border-blue-500/20 hover:border-blue-400 cursor-pointer transition-all space-y-2 group"
            >
              <Video className="w-6 h-6 text-blue-400" />
              <h4 className="text-base font-bold text-white group-hover:text-blue-300">
                YouTube Lecture Manager &rarr;
              </h4>
              <p className="text-xs text-slate-400">
                Organize unlisted YouTube video lectures, modules, and PDF slide attachments.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FOUNDER PROFILE & IMAGE EDITOR (Section 2 Requirement) */}
      {activeTab === 'founder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Founder Details & Image Controller (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSaveFounder} className="p-6 sm:p-8 rounded-3xl bg-[#0d1a38] border border-white/10 space-y-5 shadow-2xl">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                  Section 2 Specification
                </span>
                <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  Founder Profile & Image Manager
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  The admin has full authority to edit Zohaib Ali's photo URL, upload a new image, preview it, adjust biography details, or restore the original portrait.
                </p>
              </div>

              {/* Image URL with Restore Button */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white">
                    Founder Portrait Image URL *
                  </label>
                  <button
                    type="button"
                    onClick={handleRestoreOriginalFounderImage}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Original Image</span>
                  </button>
                </div>

                <input
                  type="text"
                  required
                  value={founderImage}
                  onChange={(e) => setFounderImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-400"
                />
                <p className="text-[11px] text-slate-400">
                  Default Official Image: <span className="font-mono text-cyan-400 truncate block">{defaultFounderImage}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Founder Full Name *</label>
                  <input
                    type="text"
                    required
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Official Designation *</label>
                  <input
                    type="text"
                    required
                    value={founderTitle}
                    onChange={(e) => setFounderTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Founder Vision Quote</label>
                <input
                  type="text"
                  value={founderQuote}
                  onChange={(e) => setFounderQuote(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Founder Biography & Background</label>
                <textarea
                  rows={4}
                  value={founderBio}
                  onChange={(e) => setFounderBio(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={founderSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{founderSaving ? 'Publishing...' : 'Save & Publish Founder Profile'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Real-Time Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Live Website Preview
            </h4>
            <div className="p-6 rounded-3xl bg-[#060e22] border-2 border-cyan-400/40 shadow-xl space-y-4 text-center">
              <div className="relative aspect-[3/4] w-48 mx-auto rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-2xl bg-slate-950">
                <img
                  src={founderImage}
                  alt={founderName}
                  className="w-full h-full object-cover object-top"
                  onError={() => {
                    alert('Image URL failed to load. Please check the URL.');
                  }}
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">{founderName}</h3>
                <p className="text-xs font-semibold text-cyan-400">{founderTitle}</p>
                <p className="text-[11px] text-slate-400">ZA GLOBAL TECH INSTITUTE</p>
              </div>
              <p className="text-[11px] text-cyan-100/90 italic p-3 rounded-xl bg-slate-900/60 border border-white/5">
                "{founderQuote}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MEDIA LIBRARY (Section 5 Requirement) */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1a38] border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                  Central Asset Repository
                </span>
                <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  Media Library & Image Manager
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage photos for the founder, teachers, homepage banners, courses, and project showcases.
                </p>
              </div>

              <button
                onClick={() => setShowAddMediaModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Image to Library</span>
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {['all', 'founder', 'banners', 'courses', 'teachers', 'projects', 'logos'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMediaCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg uppercase tracking-wider font-semibold transition-all shrink-0 ${
                    mediaCategoryFilter === cat
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mediaList
                .filter((m) => mediaCategoryFilter === 'all' || m.category === mediaCategoryFilter)
                .map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-slate-900 border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-cyan-400/40 transition-all shadow-xl"
                  >
                    <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-950/80 text-cyan-300">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{item.alt}</p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <button
                          onClick={() => handleCopyUrl(item.url, item.id)}
                          className="px-2.5 py-1 rounded bg-slate-800 text-[11px] font-mono text-slate-300 hover:text-white flex items-center gap-1"
                        >
                          {copiedMediaId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedMediaId === item.id ? 'Copied' : 'Copy URL'}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteMedia(item.id)}
                          className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                          title="Delete image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Add Media Modal */}
          {showAddMediaModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <form onSubmit={handleAddMedia} className="w-full max-w-md bg-[#0d1a38] border border-cyan-400/40 rounded-2xl p-6 space-y-4 shadow-2xl">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">Add Image to Media Library</h3>
                  <button type="button" onClick={() => setShowAddMediaModal(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Image Title *</label>
                  <input
                    type="text"
                    required
                    value={newMediaTitle}
                    onChange={(e) => setNewMediaTitle(e.target.value)}
                    placeholder="e.g. AI Automation Classroom Banner"
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Image URL *</label>
                  <input
                    type="text"
                    required
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or https://i.ibb.co/..."
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                    <select
                      value={newMediaCategory}
                      onChange={(e) => setNewMediaCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="founder">Founder</option>
                      <option value="banners">Banners</option>
                      <option value="courses">Courses</option>
                      <option value="teachers">Teachers</option>
                      <option value="projects">Projects</option>
                      <option value="logos">Logos</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Alt Text</label>
                    <input
                      type="text"
                      value={newMediaAlt}
                      onChange={(e) => setNewMediaAlt(e.target.value)}
                      placeholder="SEO description..."
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                  <button type="button" onClick={() => setShowAddMediaModal(false)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md">Add Image</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: FREE / PAID PRICING MANAGER (Section 4 & 8 Requirement) */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1a38] border border-white/10 space-y-4">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                Critical Commercial Controller
              </span>
              <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Course Pricing & Free/Paid Status Manager
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Toggle any course between Free (automatically PKR 0) or Paid Pro. Set custom PKR prices, discount rates, and manage promotional campaigns.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="py-3 px-3">Course Title</th>
                    <th className="py-3 px-3">Current Status</th>
                    <th className="py-3 px-3">Price (PKR)</th>
                    <th className="py-3 px-3">Discounted (PKR)</th>
                    <th className="py-3 px-3">Enrolled</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {courses.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5">
                      <td className="py-3 px-3 font-semibold text-white max-w-xs truncate">{c.title}</td>
                      <td className="py-3 px-3">
                        {c.isFree ? (
                          <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-extrabold uppercase text-[10px]">
                            FREE (PKR 0)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md bg-blue-600/20 text-blue-400 font-extrabold uppercase text-[10px]">
                            PAID PRO
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-white">
                        {c.isFree ? 'PKR 0' : `PKR ${c.price.toLocaleString()}`}
                      </td>
                      <td className="py-3 px-3 font-mono text-amber-400 font-semibold">
                        {c.isFree ? '—' : c.discountedPrice ? `PKR ${c.discountedPrice.toLocaleString()}` : 'None'}
                      </td>
                      <td className="py-3 px-3 text-slate-400 font-mono">{c.enrollmentCount}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setEditingPricingCourse(c);
                            setPricingIsFree(c.isFree);
                            setPricingPrice(c.price);
                            setPricingDiscount(c.discountedPrice || 0);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md"
                        >
                          Modify Pricing
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Modal */}
          {editingPricingCourse && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <form onSubmit={handleSavePricing} className="w-full max-w-md bg-[#0d1a38] border border-amber-400/40 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">Edit Course Pricing</h3>
                  <button type="button" onClick={() => setEditingPricingCourse(null)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="text-xs text-slate-300 font-semibold">
                  Course: <span className="text-amber-300">{editingPricingCourse.title}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">Course Model:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPricingIsFree(true);
                        setPricingPrice(0);
                        setPricingDiscount(0);
                      }}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        pricingIsFree ? 'bg-emerald-500 text-slate-950 font-black shadow-md' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      FREE (PKR 0)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPricingIsFree(false)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        !pricingIsFree ? 'bg-blue-600 text-white font-black shadow-md' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      PAID PRO
                    </button>
                  </div>
                </div>

                {!pricingIsFree && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Regular Price in PKR *</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={pricingPrice}
                        onChange={(e) => setPricingPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Discounted Offer Price in PKR</label>
                      <input
                        type="number"
                        min={0}
                        value={pricingDiscount}
                        onChange={(e) => setPricingDiscount(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                  <button type="button" onClick={() => setEditingPricingCourse(null)} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md">Enforce Pricing</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: YOUTUBE LECTURE MANAGER (Section 5 & 9 Requirement) */}
      {activeTab === 'youtube' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1a38] border border-white/10 space-y-6">
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
              Existing Unlisted Lectures
            </span>
            <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
              YouTube Video Lecture & Module Publisher
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Connect your unlisted or public YouTube video URLs directly without re-uploading large video files.
            </p>
          </div>

          <form onSubmit={handleAddYoutubeLecture} className="space-y-4 max-w-2xl">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Target Course *</label>
              <select
                value={selectedYoutubeCourse?.id || 1}
                onChange={(e) => {
                  const found = courses.find((c) => c.id === Number(e.target.value));
                  if (found) setSelectedYoutubeCourse(found);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Lecture Title *</label>
                <input
                  type="text"
                  required
                  value={lectureTitle}
                  onChange={(e) => setLectureTitle(e.target.value)}
                  placeholder="e.g. 2.1 Transformer Attention Mechanics"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">YouTube URL (Unlisted / Public) *</label>
                <input
                  type="text"
                  required
                  value={lectureYoutubeUrl}
                  onChange={(e) => setLectureYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Duration</label>
                <input
                  type="text"
                  value={lectureDuration}
                  onChange={(e) => setLectureDuration(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Downloadable PDF Link</label>
                <input
                  type="text"
                  value={lecturePdfUrl}
                  onChange={(e) => setLecturePdfUrl(e.target.value)}
                  placeholder="https://example.com/slides.pdf"
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Lecture Summary & Notes</label>
              <textarea
                rows={2}
                value={lectureDesc}
                onChange={(e) => setLectureDesc(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="admPrevCheck"
                checked={lectureIsPreview}
                onChange={(e) => setLectureIsPreview(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-cyan-400"
              />
              <label htmlFor="admPrevCheck" className="text-xs text-slate-300">
                Allow Free Preview (Non-enrolled visitors can watch this preview)
              </label>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20"
            >
              Add Lecture to Course
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: COURSES MANAGEMENT */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1a38] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider mb-2">
                <BookOpen className="w-3 h-3 text-cyan-400" />
                <span>Academic Curriculum Director</span>
              </div>
              <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                All Institute Courses ({courses.length})
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Create new offerings, edit titles, descriptions, pricing, and thumbnails, or permanently remove courses across all 17 technology domains.
              </p>
            </div>

            <button
              onClick={handleOpenCreateCourse}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Course</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-slate-900 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-white/5">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-black text-cyan-300 border border-cyan-500/30 uppercase">
                        {c.categoryName || 'Tech'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          c.isFree
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {c.isFree ? 'FREE' : `PKR ${c.price.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-slate-300 border border-white/10">
                        {c.difficulty}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                      {c.title}
                    </h4>
                    {c.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {c.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                    <span>{c.duration}</span>
                    <span>{c.enrollmentCount || 0} Students Enrolled</span>
                  </div>
                </div>

                {/* Course Actions Row */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleOpenEditCourse(c)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/20 text-xs font-bold transition-all flex items-center gap-1"
                      title="Edit Course Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingPricingCourse(c);
                        setPricingIsFree(c.isFree);
                        setPricingPrice(c.price);
                        setPricingDiscount(c.discountedPrice || 0);
                        setActiveTab('pricing');
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                      title="Quick Pricing Setup"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedResourceCourseId(c.id);
                        setActiveTab('resources');
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                      title="Manage Course Learning Resources"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedYoutubeCourse(c);
                        setActiveTab('youtube');
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                      title="Manage YouTube Lectures"
                    >
                      <Video className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteCourse(c)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-xs font-bold transition-all shrink-0"
                    title="Delete Course"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* COURSE CREATE / EDIT MODAL */}
          {showCourseModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
              <div className="relative w-full max-w-2xl my-8 p-6 sm:p-8 rounded-3xl bg-[#0d1a38] border border-cyan-500/30 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-['Space_Grotesk']">
                        {editingCourse ? 'Course Editor' : 'New Offering'}
                      </span>
                      <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                        {editingCourse ? `Edit: ${editingCourse.title}` : 'Create New Institute Course'}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCourseModal(false)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveCourse} className="space-y-5 text-xs">
                  {/* Title & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-slate-300 font-bold block mb-1">
                        Course Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={courseFormTitle}
                        onChange={(e) => setCourseFormTitle(e.target.value)}
                        placeholder="e.g. Full-Stack Web Development: React & Node.js"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-bold block mb-1">
                        Domain Category *
                      </label>
                      <select
                        value={courseFormCategoryId}
                        onChange={(e) => setCourseFormCategoryId(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-300 font-bold block mb-1">
                        Difficulty Level
                      </label>
                      <select
                        value={courseFormDifficulty}
                        onChange={(e) => setCourseFormDifficulty(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="All Levels">All Levels</option>
                      </select>
                    </div>
                  </div>

                  {/* Free vs Paid Toggle & Pricing */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="courseFreeToggle"
                        checked={courseFormIsFree}
                        onChange={(e) => setCourseFormIsFree(e.target.checked)}
                        className="w-4 h-4 rounded text-cyan-400 bg-slate-950 border-slate-700"
                      />
                      <label htmlFor="courseFreeToggle" className="text-xs font-bold text-emerald-400">
                        Mark as 100% Free Learning Track (PKR 0)
                      </label>
                    </div>

                    {!courseFormIsFree && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                        <div>
                          <label className="text-slate-300 font-bold block mb-1">
                            Standard Fee (PKR)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={courseFormPrice}
                            onChange={(e) => setCourseFormPrice(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-300 font-bold block mb-1">
                            Discounted / Promo Fee (PKR)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={courseFormDiscountedPrice}
                            onChange={(e) => setCourseFormDiscountedPrice(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Duration & Thumbnail */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">
                        Course Duration
                      </label>
                      <input
                        type="text"
                        value={courseFormDuration}
                        onChange={(e) => setCourseFormDuration(e.target.value)}
                        placeholder="e.g. 8 Weeks, 12 Weeks, 40 Hours"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 font-bold block mb-1">
                        Thumbnail Image URL
                      </label>
                      <input
                        type="url"
                        value={courseFormThumbnail}
                        onChange={(e) => setCourseFormThumbnail(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  {courseFormThumbnail && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                      <img
                        src={courseFormThumbnail}
                        alt="Preview"
                        className="w-20 aspect-video object-cover rounded-lg border border-cyan-500/30"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                      <span className="text-[11px] text-slate-400">
                        Live thumbnail preview
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">
                      Course Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={courseFormDesc}
                      onChange={(e) => setCourseFormDesc(e.target.value)}
                      placeholder="Comprehensive overview of what this course covers and who should take it..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
                    />
                  </div>

                  {/* Learning Outcomes & Prerequisites */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">
                        Learning Outcomes (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={courseFormOutcomes}
                        onChange={(e) => setCourseFormOutcomes(e.target.value)}
                        placeholder="Build real-world client projects&#10;Master modern tools & frameworks&#10;Prepare for freelancing careers"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">
                        Prerequisites
                      </label>
                      <textarea
                        rows={3}
                        value={courseFormPrereqs}
                        onChange={(e) => setCourseFormPrereqs(e.target.value)}
                        placeholder="Basic computer skills&#10;High-speed internet&#10;Enthusiasm to learn"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Checkboxes: Certificate Eligible & Published */}
                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="courseCertCheck"
                        checked={courseFormCertEligible}
                        onChange={(e) => setCourseFormCertEligible(e.target.checked)}
                        className="w-4 h-4 rounded text-cyan-400 bg-slate-950 border-slate-700"
                      />
                      <label htmlFor="courseCertCheck" className="text-xs text-slate-300">
                        Eligible for Digital Certificate of Completion
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="coursePublishCheck"
                        checked={courseFormIsPublished}
                        onChange={(e) => setCourseFormIsPublished(e.target.checked)}
                        className="w-4 h-4 rounded text-cyan-400 bg-slate-950 border-slate-700"
                      />
                      <label htmlFor="coursePublishCheck" className="text-xs text-slate-300">
                        Published & Visible on Public Website
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setShowCourseModal(false)}
                      className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={courseSaving}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
                    >
                      {courseSaving && <RefreshCw className="w-4 h-4 animate-spin" />}
                      <span>{editingCourse ? 'Save Changes' : 'Create Course'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: OUR TEAM MANAGEMENT (Section 2 Requirement) */}
      {activeTab === 'team' && (
        <div className="space-y-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1a38] border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-['Space_Grotesk']">
                  Faculty & Leadership
                </span>
                <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                  Institute Team Profiles ({teamList.length})
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage the 4 official leadership profiles (Zohaib Ali, Shehzade Ali, Sher Ali, Rahmat Ali) and additional team members. Change names, titles, photos, bios, visibility, and display order.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleRestoreDefaultFacultyTeam}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-amber-400/30 hover:border-amber-400 text-amber-300 font-bold text-xs transition-all flex items-center gap-1.5"
                  title="Restore Zohaib Ali, Shehzade Ali, Sher Ali, and Rahmat Ali"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Restore Official Faculty</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingTeamMember(null);
                    setTeamFormName('');
                    setTeamFormRole('');
                    setTeamFormImage('');
                    setTeamFormBio('');
                    setTeamFormSpec('');
                    setTeamFormOrder(teamList.length + 1);
                    setTeamFormVisible(true);
                    setShowAddTeamModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Team Member</span>
                </button>
              </div>
            </div>

            {/* Team Profiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamList.map((member) => (
                <div
                  key={member.id}
                  className={`p-5 rounded-2xl bg-slate-900 border transition-all flex flex-col justify-between space-y-4 ${
                    member.isVisible ? 'border-white/10' : 'border-red-500/30 opacity-70'
                  }`}
                >
                  <div className="space-y-4 text-center">
                    <div className="relative w-24 h-28 mx-auto rounded-xl overflow-hidden bg-slate-950 border-2 border-cyan-400/40 shadow-md">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top"
                      />
                      {!member.isVisible && (
                        <div className="absolute inset-0 bg-red-950/70 flex items-center justify-center text-[10px] font-bold text-red-300">
                          Hidden
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider line-clamp-1">
                          {member.role}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{member.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{member.bio}</p>
                    </div>

                    {member.specialization && (
                      <div className="text-[10px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-white/5 truncate">
                        {member.specialization}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleTeamVisibility(member)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                        member.isVisible
                          ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                      }`}
                    >
                      {member.isVisible ? 'Visible' : 'Hidden'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setEditingTeamMember(member);
                          setTeamFormName(member.name);
                          setTeamFormRole(member.role);
                          setTeamFormImage(member.image);
                          setTeamFormBio(member.bio);
                          setTeamFormSpec(member.specialization || '');
                          setTeamFormOrder(member.order);
                          setTeamFormVisible(member.isVisible);
                          setShowAddTeamModal(true);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteTeamMember(member.id, member.name)}
                        className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add / Edit Team Member Modal */}
          {showAddTeamModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="w-full max-w-xl bg-[#0d1a38] border border-cyan-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                    {editingTeamMember ? `Edit Team Member: ${editingTeamMember.name}` : 'Add New Team Member'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTeamModal(false);
                      setEditingTeamMember(null);
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveTeamMember} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={teamFormName}
                        onChange={(e) => setTeamFormName(e.target.value)}
                        placeholder="e.g. Shehzade Ali"
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Job Title / Role *</label>
                      <input
                        type="text"
                        required
                        value={teamFormRole}
                        onChange={(e) => setTeamFormRole(e.target.value)}
                        placeholder="e.g. Principal Engineer — Web Development"
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Profile Image URL *</label>
                    <input
                      type="url"
                      required
                      value={teamFormImage}
                      onChange={(e) => setTeamFormImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>

                  {/* Live Image Preview */}
                  {teamFormImage && (
                    <div className="p-3 rounded-xl bg-slate-950 border border-white/10 flex items-center gap-4">
                      <img
                        src={teamFormImage}
                        alt="Preview"
                        className="w-16 h-20 object-cover object-top rounded-lg border border-cyan-400/50"
                      />
                      <div className="text-xs space-y-1">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Image Preview Verified</span>
                        <p className="text-slate-300 text-xs font-semibold">{teamFormName || 'Name'}</p>
                        <p className="text-[11px] text-slate-400">{teamFormRole || 'Role'}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Biography & Credentials *</label>
                    <textarea
                      required
                      rows={3}
                      value={teamFormBio}
                      onChange={(e) => setTeamFormBio(e.target.value)}
                      placeholder="Detailed background, accomplishments, and instructional philosophy..."
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Core Specialization</label>
                      <input
                        type="text"
                        value={teamFormSpec}
                        onChange={(e) => setTeamFormSpec(e.target.value)}
                        placeholder="e.g. React, Next.js & Full-Stack Systems"
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Display Order</label>
                      <input
                        type="number"
                        min={1}
                        value={teamFormOrder}
                        onChange={(e) => setTeamFormOrder(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="teamVisCheck"
                      checked={teamFormVisible}
                      onChange={(e) => setTeamFormVisible(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-400"
                    />
                    <label htmlFor="teamVisCheck" className="text-xs text-slate-300 font-medium">
                      Publish profile on Public Team Page and Homepage
                    </label>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddTeamModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs shadow-md"
                    >
                      {editingTeamMember ? 'Update Profile' : 'Publish Member'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: TEMPLATES & LEARNING RESOURCES (Section 8 Requirement) */}
      {activeTab === 'resources' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1a38] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-['Space_Grotesk']">
                Educational Materials
              </span>
              <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                Course Resources, Starter Files & Templates
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Upload and attach downloadable PDF notes, starter code repositories, Figma design kits, worksheets, and exercises for students.
              </p>
            </div>

            {/* Course Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Filter Course:</span>
              <select
                value={selectedResourceCourseId}
                onChange={(e) => loadCourseResources(Number(e.target.value))}
                className="px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white font-medium"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* New Resource Form */}
          <form onSubmit={handleCreateResource} className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Space_Grotesk']">
              Attach New Resource to Selected Course
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  value={newResourceTitle}
                  onChange={(e) => setNewResourceTitle(e.target.value)}
                  placeholder="e.g. Complete React + Tailwind Starter Scaffolding (Zip)"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">File Type *</label>
                <select
                  value={newResourceType}
                  onChange={(e) => setNewResourceType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option value="PDF">PDF Document / Cheatsheet</option>
                  <option value="Source Code">Source Code File</option>
                  <option value="Project Zip">Project Zip Archive</option>
                  <option value="Figma Template">Figma Design Kit</option>
                  <option value="Worksheet">Practice Worksheet</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Download URL *</label>
                <input
                  type="url"
                  required
                  value={newResourceUrl}
                  onChange={(e) => setNewResourceUrl(e.target.value)}
                  placeholder="https://... (Drive, GitHub, or direct file link)"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Approximate File Size</label>
                <input
                  type="text"
                  value={newResourceSize}
                  onChange={(e) => setNewResourceSize(e.target.value)}
                  placeholder="e.g. 4.2 MB"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Description & Usage Instructions</label>
              <textarea
                rows={2}
                value={newResourceDesc}
                onChange={(e) => setNewResourceDesc(e.target.value)}
                placeholder="How students should unpack and use this template in exercises..."
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="protResCheck"
                  checked={newResourceProtected}
                  onChange={(e) => setNewResourceProtected(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-400"
                />
                <label htmlFor="protResCheck" className="text-xs text-slate-300">
                  Protect Resource (Only enrolled students can download)
                </label>
              </div>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs shadow-md"
              >
                Attach Resource
              </button>
            </div>
          </form>

          {/* Existing Resources List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Space_Grotesk']">
              Attached Resources for Selected Course ({resourcesList.length})
            </h4>

            {resourcesList.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 bg-slate-900/40 rounded-xl">
                No templates or resource files attached to this course yet.
              </p>
            ) : (
              <div className="space-y-2">
                {resourcesList.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between gap-4 hover:border-cyan-400/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 shrink-0 font-bold text-xs font-mono">
                        {res.fileType.substring(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">{res.title}</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">{res.description || 'Downloadable learning asset'}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                          <span>Format: {res.fileType}</span>
                          <span>•</span>
                          <span>Size: {res.fileSize}</span>
                          <span>•</span>
                          <span className={res.isProtected ? 'text-amber-400' : 'text-emerald-400'}>
                            {res.isProtected ? 'Enrolled Students Only' : 'Public Asset'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                      >
                        Preview Link
                      </a>
                      <button
                        onClick={() => handleDeleteResource(res.id)}
                        className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        title="Remove Resource"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: 17 COURSE CATEGORIES (Section 5 Requirement) */}
      {activeTab === 'categories' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1a38] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-['Space_Grotesk']">
                Curriculum Structure
              </span>
              <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                17 Official Course Disciplines ({categories.length})
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Manage all 17 technology domains. Add new categories, edit descriptions, or remove categories.
              </p>
            </div>
          </div>

          {/* New Category Form */}
          <form onSubmit={handleCreateCategory} className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-['Space_Grotesk']">
              Create New Category
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                    setNewCategorySlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }}
                  placeholder="e.g. Cloud DevOps Engineering"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Category Slug *</label>
                <input
                  type="text"
                  required
                  value={newCategorySlug}
                  onChange={(e) => setNewCategorySlug(e.target.value)}
                  placeholder="cloud-devops"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Icon Name</label>
                <input
                  type="text"
                  value={newCategoryIcon}
                  onChange={(e) => setNewCategoryIcon(e.target.value)}
                  placeholder="Cpu / Code / Terminal"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Description</label>
              <input
                type="text"
                value={newCategoryDesc}
                onChange={(e) => setNewCategoryDesc(e.target.value)}
                placeholder="Short domain summary..."
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs shadow-md"
            >
              Add Category
            </button>
          </form>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-4 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between hover:border-cyan-400/30 transition-colors"
              >
                <div>
                  <h5 className="text-xs font-bold text-white font-['Space_Grotesk']">{cat.name}</h5>
                  <span className="text-[10px] text-slate-500 font-mono">{cat.slug}</span>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{cat.description || 'Active discipline'}</p>
                </div>
                <button
                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                  className="p-1.5 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-2"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: PAGE CONTENT CMS (Hero, About, Privacy, Terms) */}
      {activeTab === 'pages' && (
        <form onSubmit={handleSavePageContent} className="p-6 sm:p-8 rounded-3xl bg-[#0d1a38] border border-white/10 space-y-6 max-w-4xl">
          <div>
            <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">Website Page Content & Policies CMS</h3>
            <p className="text-xs text-slate-400 mt-1">
              Modify text, headlines, hero buttons, privacy policy, and terms of service across the entire platform.
            </p>
          </div>

          {/* Hero Section */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/5 space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Homepage Hero Section</span>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Headline</label>
              <input
                type="text"
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Description</label>
              <textarea
                rows={2}
                value={heroDesc}
                onChange={(e) => setHeroDesc(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Primary Button</label>
                <input
                  type="text"
                  value={heroPrimaryBtn}
                  onChange={(e) => setHeroPrimaryBtn(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">Secondary Button</label>
                <input
                  type="text"
                  value={heroSecondaryBtn}
                  onChange={(e) => setHeroSecondaryBtn(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>
          </div>

          {/* Privacy Policy */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Privacy Policy Page Content</span>
            <textarea
              rows={4}
              value={privacyPolicyContent}
              onChange={(e) => setPrivacyPolicyContent(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>

          {/* Terms & Conditions */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/5 space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Terms & Conditions Page Content</span>
            <textarea
              rows={4}
              value={termsContent}
              onChange={(e) => setTermsContent(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20"
          >
            Save All Content Changes
          </button>
        </form>
      )}

      {/* TAB 9: PAYMENTS VERIFICATION & APPROVALS */}
      {activeTab === 'payments' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1a38] border border-white/10 space-y-4">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Financial Auditing
            </span>
            <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
              Fee Receipts & Enrollment Approvals
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Verify EasyPaisa, JazzCash, and Meezan Bank transaction references submitted by students. Approving unlocks course access automatically.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-3 px-3">Transaction ID</th>
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3">Course</th>
                  <th className="py-3 px-3">Amount (PKR)</th>
                  <th className="py-3 px-3">Method</th>
                  <th className="py-3 px-3">Sender Ref / Notes</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5">
                    <td className="py-3 px-3 font-mono text-cyan-300 font-bold">{p.transactionId}</td>
                    <td className="py-3 px-3 font-semibold text-white">{p.studentName}</td>
                    <td className="py-3 px-3">{p.courseTitle}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                      PKR {p.finalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">{p.paymentMethod}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-300">{p.providerReference || 'None'}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.paymentStatus === 'Successful' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {p.paymentStatus !== 'Successful' ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleUpdatePaymentStatus(p.id, 'Successful')}
                            className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] shadow-sm"
                          >
                            Approve & Enroll
                          </button>
                          <button
                            onClick={() => handleUpdatePaymentStatus(p.id, 'Failed')}
                            className="px-2.5 py-1 rounded bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white text-[11px]"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 10: STUDENT ACCOUNTS */}
      {activeTab === 'students' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1a38] border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
            Registered Student Accounts ({usersList.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Country</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5">
                    <td className="py-2.5 px-3 font-semibold text-white">{u.fullName}</td>
                    <td className="py-2.5 px-3 text-slate-300">{u.email}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{u.country || 'Pakistan'}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {u.role !== 'super_admin' && (
                        <button
                          onClick={() => handleUpdateUserStatus(u.id, u.status === 'active' ? 'suspended' : 'active')}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                        >
                          {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 11: BRANDING & ACCOUNTS */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding} className="p-6 sm:p-8 rounded-3xl bg-[#0d1a38] border border-white/10 space-y-6 max-w-3xl">
          <div>
            <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
              Institute Branding & Bank Accounts
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Configure brand titles, official contact hotlines, and fee submission deposit accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 block font-bold mb-1">Institute Brand Name</label>
              <input type="text" value={instituteName} onChange={(e) => setInstituteName(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
            </div>
            <div>
              <label className="text-slate-300 block font-bold mb-1">Official Tagline</label>
              <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
            </div>
            <div>
              <label className="text-slate-300 block font-bold mb-1">Official Email</label>
              <input type="email" value={officialEmail} onChange={(e) => setOfficialEmail(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
            </div>
            <div>
              <label className="text-slate-300 block font-bold mb-1">Phone / WhatsApp</label>
              <input type="text" value={officialPhone} onChange={(e) => setOfficialPhone(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
            </div>
            <div>
              <label className="text-slate-300 block font-bold mb-1">Meezan Bank Title</label>
              <input type="text" value={bankTitle} onChange={(e) => setBankTitle(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white" />
            </div>
            <div>
              <label className="text-slate-300 block font-bold mb-1">Meezan Bank IBAN</label>
              <input type="text" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono" />
            </div>
            <div>
              <label className="text-slate-300 block font-bold mb-1">EasyPaisa Account</label>
              <input type="text" value={easypaisaAccount} onChange={(e) => setEasypaisaAccount(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono" />
            </div>
            <div>
              <label className="text-slate-300 block font-bold mb-1">JazzCash Account</label>
              <input type="text" value={jazzcashAccount} onChange={(e) => setJazzcashAccount(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono" />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20"
          >
            Save Branding & Financial Accounts
          </button>
        </form>
      )}
    </div>
  );
};
