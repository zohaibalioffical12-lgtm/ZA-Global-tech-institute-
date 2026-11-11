export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'student';

export interface User {
  id: number;
  uid: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  country?: string | null;
  role: UserRole;
  profileImage?: string | null;
  bio?: string | null;
  status: 'active' | 'suspended';
  createdAt?: string;
}

export interface CourseCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description?: string | null;
  courseCount?: number;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  categoryId?: number | null;
  categoryName?: string;
  categorySlug?: string;
  instructorId?: number | null;
  instructorName?: string;
  instructor?: {
    id: number;
    fullName: string;
    profileImage?: string | null;
    bio?: string | null;
    email?: string;
  } | null;
  thumbnail: string;
  description: string;
  learningObjectives?: string | null; // JSON string array
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  modulesCount: number;
  lecturesCount: number;
  language: string;
  prerequisites?: string | null;
  price: number; // in PKR
  discountedPrice?: number | null;
  isFree: boolean;
  isPublished: boolean;
  enrollmentCount: number;
  rating: string;
  ratingCount: number;
  certificateEligible: boolean;
  resources?: string | null;
  curriculum?: CourseModuleWithLessons[];
  createdAt?: string;
}

export interface CourseModule {
  id: number;
  courseId: number;
  title: string;
  description?: string | null;
  sequence: number;
}

export interface Lesson {
  id: number;
  courseId: number;
  moduleId: number;
  title: string;
  youtubeUrl?: string | null;
  duration?: string | null;
  sequence: number;
  description?: string | null;
  pdfResources?: string | null;
  isPublished: boolean;
  isPreview: boolean;
  isLocked?: boolean;
}

export interface CourseModuleWithLessons extends CourseModule {
  lessons: Lesson[];
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  enrollmentType: 'free' | 'paid';
  status: 'active' | 'suspended' | 'completed';
  progressPercent: number;
  completedLessons?: string; // JSON array of numbers
  enrolledAt: string;
  completedAt?: string | null;
  course?: Course;
}

export interface Payment {
  id: number;
  transactionId: string;
  userId: number;
  courseId: number;
  originalPrice: number;
  discount: number;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Successful' | 'Failed' | 'Refunded' | 'Under Review';
  providerReference?: string | null;
  proofNotes?: string | null;
  paymentDate: string;
  studentName?: string;
  studentEmail?: string;
  studentPhone?: string;
  courseTitle?: string;
}

export interface Certificate {
  id: number;
  certificateId: string;
  userId: number;
  courseId: number;
  studentName: string;
  courseTitle: string;
  issueDate: string;
  verificationCode: string;
  qrCodeUrl?: string | null;
  issuer: string;
  createdAt?: string;
}

export interface Assignment {
  id: number;
  courseId: number;
  moduleId?: number | null;
  title: string;
  instructions: string;
  deadline: string;
  referenceUrl?: string | null;
  totalMarks: number;
}

export interface Submission {
  id: number;
  assignmentId: number;
  studentId: number;
  submissionText: string;
  fileUrl?: string | null;
  marks?: number | null;
  feedback?: string | null;
  status: 'submitted' | 'graded';
  submittedAt: string;
  gradedAt?: string | null;
  assignmentTitle?: string;
  totalMarks?: number;
  studentName?: string;
  studentEmail?: string;
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'short_answer';
  options: string[];
  explanation?: string;
}

export interface Quiz {
  id: number;
  courseId: number;
  title: string;
  instructions?: string | null;
  timeLimitMinutes: number;
  passingMarks: number;
  totalMarks: number;
  questions?: QuizQuestion[];
}

export interface InstituteStats {
  totalStudents: number;
  totalCourses: number;
  totalTeachers: number;
  totalCompleted: number;
  totalEnrollments: number;
  verifiedRevenuePKR: number;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  category: 'founder' | 'banners' | 'courses' | 'teachers' | 'projects' | 'logos' | 'general';
  alt: string;
  uploadedAt?: string;
}

export interface SiteSettings {
  institute_name: string;
  founder_name: string;
  founder_title?: string;
  founder_image?: string;
  founder_bio?: string;
  founder_quote?: string;
  founder_experience?: string;
  founder_achievements?: string;
  tagline: string;
  hero_headline?: string;
  hero_description?: string;
  hero_cta_primary?: string;
  hero_cta_secondary?: string;
  privacy_policy?: string;
  terms_conditions?: string;
  media_library?: string;
  theme_accent?: string;
  official_email: string;
  phone_number: string;
  whatsapp_number: string;
  address: string;
  currency: string;
  bank_title?: string;
  bank_account?: string;
  easypaisa_account?: string;
  jazzcash_account?: string;
  logo_url?: string;
  [key: string]: string | undefined;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
  order: number;
  isVisible: boolean;
  specialization?: string | null;
  createdAt?: string;
}

export interface CourseResource {
  id: number;
  courseId: number;
  lessonId?: number | null;
  title: string;
  description?: string | null;
  fileType: 'PDF' | 'Source Code' | 'Figma Template' | 'Worksheet' | 'Project Zip' | string;
  fileUrl: string;
  fileSize?: string | null;
  isProtected: boolean;
  downloadsCount: number;
  createdAt?: string;
}
