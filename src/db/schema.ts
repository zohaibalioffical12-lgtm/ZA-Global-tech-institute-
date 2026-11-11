import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  fullName: text('full_name').notNull().default('Student User'),
  phoneNumber: text('phone_number'),
  country: text('country').default('Pakistan'),
  role: text('role').notNull().default('student'), // 'super_admin' | 'admin' | 'teacher' | 'student'
  profileImage: text('profile_image'),
  bio: text('bio'),
  status: text('status').notNull().default('active'), // 'active' | 'suspended'
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Course Categories
export const courseCategories = pgTable('course_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  icon: text('icon').notNull().default('Sparkles'),
  description: text('description'),
  courseCount: integer('course_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Courses
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  categoryId: integer('category_id').references(() => courseCategories.id),
  instructorId: integer('instructor_id').references(() => users.id),
  thumbnail: text('thumbnail').notNull(),
  description: text('description').notNull(),
  learningObjectives: text('learning_objectives'), // JSON string array of outcomes
  difficulty: text('difficulty').notNull().default('Beginner'), // 'Beginner' | 'Intermediate' | 'Advanced'
  duration: text('duration').notNull().default('8 Weeks'),
  modulesCount: integer('modules_count').default(0),
  lecturesCount: integer('lectures_count').default(0),
  language: text('language').default('Urdu / English'),
  prerequisites: text('prerequisites'),
  price: integer('price').notNull().default(0), // in PKR
  discountedPrice: integer('discounted_price').default(0), // in PKR
  isFree: boolean('is_free').notNull().default(true),
  isPublished: boolean('is_published').notNull().default(true),
  enrollmentCount: integer('enrollment_count').default(0),
  rating: text('rating').default('5.0'),
  ratingCount: integer('rating_count').default(0),
  certificateEligible: boolean('certificate_eligible').default(true),
  resources: text('resources'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Course Modules
export const courseModules = pgTable('course_modules', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  sequence: integer('sequence').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. Lessons (YouTube integration)
export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  moduleId: integer('module_id').references(() => courseModules.id).notNull(),
  title: text('title').notNull(),
  youtubeUrl: text('youtube_url').notNull(),
  duration: text('duration').default('15 mins'),
  sequence: integer('sequence').notNull().default(1),
  description: text('description'),
  pdfResources: text('pdf_resources'), // JSON string array
  isPublished: boolean('is_published').default(true),
  isPreview: boolean('is_preview').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// 6. Enrollments
export const enrollments = pgTable('enrollments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  enrollmentType: text('enrollment_type').notNull().default('free'), // 'free' | 'paid'
  status: text('status').notNull().default('active'), // 'active' | 'suspended' | 'completed'
  progressPercent: integer('progress_percent').default(0),
  completedLessons: text('completed_lessons').default('[]'), // JSON array of lesson IDs
  enrolledAt: timestamp('enrolled_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

// 7. Payments
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  transactionId: text('transaction_id').notNull().unique(),
  userId: integer('user_id').references(() => users.id).notNull(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  originalPrice: integer('original_price').notNull(),
  discount: integer('discount').default(0),
  finalAmount: integer('final_amount').notNull(),
  paymentMethod: text('payment_method').notNull().default('Bank Transfer'), // 'Bank Transfer' | 'EasyPaisa' | 'JazzCash' | 'Card' | 'Manual Review'
  paymentStatus: text('payment_status').notNull().default('Pending'), // 'Pending' | 'Successful' | 'Failed' | 'Refunded' | 'Under Review'
  providerReference: text('provider_reference'),
  proofNotes: text('proof_notes'),
  paymentDate: timestamp('payment_date').defaultNow(),
});

// 8. Assignments
export const assignments = pgTable('assignments', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  moduleId: integer('module_id').references(() => courseModules.id),
  title: text('title').notNull(),
  instructions: text('instructions').notNull(),
  deadline: text('deadline').notNull(),
  referenceUrl: text('reference_url'),
  totalMarks: integer('total_marks').default(100),
  createdAt: timestamp('created_at').defaultNow(),
});

// 9. Submissions
export const submissions = pgTable('submissions', {
  id: serial('id').primaryKey(),
  assignmentId: integer('assignment_id').references(() => assignments.id).notNull(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  submissionText: text('submission_text').notNull(),
  fileUrl: text('file_url'),
  marks: integer('marks'),
  feedback: text('feedback'),
  status: text('status').notNull().default('submitted'), // 'submitted' | 'graded'
  submittedAt: timestamp('submitted_at').defaultNow(),
  gradedAt: timestamp('graded_at'),
});

// 10. Quizzes
export const quizzes = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  title: text('title').notNull(),
  instructions: text('instructions'),
  timeLimitMinutes: integer('time_limit_minutes').default(15),
  passingMarks: integer('passing_marks').default(70),
  totalMarks: integer('total_marks').default(100),
  createdAt: timestamp('created_at').defaultNow(),
});

// 11. Quiz Questions
export const quizQuestions = pgTable('quiz_questions', {
  id: serial('id').primaryKey(),
  quizId: integer('quiz_id').references(() => quizzes.id).notNull(),
  questionText: text('question_text').notNull(),
  questionType: text('question_type').notNull().default('multiple_choice'), // 'multiple_choice' | 'true_false' | 'short_answer'
  options: text('options'), // JSON string array of choices
  correctAnswer: text('correct_answer').notNull(),
  explanation: text('explanation'),
  sequence: integer('sequence').default(1),
});

// 12. Quiz Attempts
export const quizAttempts = pgTable('quiz_attempts', {
  id: serial('id').primaryKey(),
  quizId: integer('quiz_id').references(() => quizzes.id).notNull(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  score: integer('score').notNull(),
  passed: boolean('passed').notNull(),
  answers: text('answers'), // JSON object
  attemptedAt: timestamp('attempted_at').defaultNow(),
});

// 13. Digital Certificates
export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  certificateId: text('certificate_id').notNull().unique(),
  userId: integer('user_id').references(() => users.id).notNull(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  studentName: text('student_name').notNull(),
  courseTitle: text('course_title').notNull(),
  issueDate: text('issue_date').notNull(),
  verificationCode: text('verification_code').notNull().unique(),
  qrCodeUrl: text('qr_code_url'),
  issuer: text('issuer').default('Zohaib Ali — Founder & Owner'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 14. Coupons
export const coupons = pgTable('coupons', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  discountType: text('discount_type').notNull().default('percent'), // 'percent' | 'fixed'
  discountValue: integer('discount_value').notNull(),
  maxUses: integer('max_uses').default(100),
  usedCount: integer('used_count').default(0),
  courseId: integer('course_id'), // null for global
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// 15. Reviews
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  studentId: integer('student_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull().default(5),
  reviewText: text('review_text').notNull(),
  isApproved: boolean('is_approved').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// 16. Support Tickets
export const supportTickets = pgTable('support_tickets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  studentName: text('student_name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('open'), // 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: text('priority').notNull().default('normal'), // 'normal' | 'high' | 'urgent'
  response: text('response'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 17. Announcements
export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  targetRole: text('target_role').default('all'), // 'all' | 'student' | 'teacher'
  courseId: integer('course_id'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// 18. Audit Logs
export const adminAuditLogs = pgTable('admin_audit_logs', {
  id: serial('id').primaryKey(),
  adminId: integer('admin_id').references(() => users.id),
  action: text('action').notNull(),
  target: text('target').notNull(),
  details: text('details'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 19. Site Settings
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 20. Team Members
export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  image: text('image').notNull(),
  bio: text('bio').notNull(),
  order: integer('order').notNull().default(1),
  isVisible: boolean('is_visible').notNull().default(true),
  specialization: text('specialization'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 21. Course Resources & Templates
export const courseResources = pgTable('course_resources', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id').references(() => courses.id).notNull(),
  lessonId: integer('lesson_id').references(() => lessons.id),
  title: text('title').notNull(),
  description: text('description'),
  fileType: text('file_type').notNull().default('PDF'), // 'PDF' | 'Source Code' | 'Figma Template' | 'Worksheet' | 'Project Zip'
  fileUrl: text('file_url').notNull(),
  fileSize: text('file_size').default('2.4 MB'),
  isProtected: boolean('is_protected').notNull().default(true),
  downloadsCount: integer('downloads_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  enrollments: many(enrollments),
  payments: many(payments),
  submissions: many(submissions),
  quizAttempts: many(quizAttempts),
  certificates: many(certificates),
  reviews: many(reviews),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  category: one(courseCategories, {
    fields: [courses.categoryId],
    references: [courseCategories.id],
  }),
  instructor: one(users, {
    fields: [courses.instructorId],
    references: [users.id],
  }),
  modules: many(courseModules),
  lessons: many(lessons),
  enrollments: many(enrollments),
  assignments: many(assignments),
  quizzes: many(quizzes),
  reviews: many(reviews),
}));

export const courseModulesRelations = relations(courseModules, ({ one, many }) => ({
  course: one(courses, {
    fields: [courseModules.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
  module: one(courseModules, {
    fields: [lessons.moduleId],
    references: [courseModules.id],
  }),
}));
