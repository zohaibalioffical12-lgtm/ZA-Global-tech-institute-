import express, { Request, Response } from 'express';
import {
  getInstituteStats,
  getCategories,
  createCategory,
  getCourses,
  getAllCoursesAdmin,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  updateCoursePricing,
  getFullCurriculum,
  addCourseModule,
  addCourseLesson,
  enrollStudentInCourse,
  getUserEnrollments,
  updateLessonCompletion,
  createPayment,
  listPaymentsAdmin,
  updatePaymentStatus,
  getUserCertificates,
  verifyCertificateByCode,
  getAssignmentsForCourse,
  submitStudentAssignment,
  listSubmissionsForTeacher,
  gradeSubmission,
  getQuizWithQuestions,
  submitQuizAttempt,
  getSiteSettingsMap,
  updateSiteSetting,
  getApprovedReviews,
  validateCouponCode,
  listAllUsers,
  updateUserRole,
  updateUserStatus,
  getOrCreateUser,
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getCourseResources,
  createCourseResource,
  deleteCourseResource,
  updateCategory,
  deleteCategory,
  getCourseDeleteSafetyReport,
  archiveCourse,
  restoreCourse,
  deleteCourseModule,
  deleteCourseLesson,
  deleteQuiz,
  deleteAssignment,
  deleteUser,
  getAllReviewsAdmin,
  updateReviewStatus,
  deleteReview,
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  getSupportTickets,
  createSupportTicket,
  updateSupportTicketStatus,
  deleteSupportTicket,
  createAuditLog,
  getAuditLogs,
} from '../db/operations.ts';

export const apiRouter = express.Router();

apiRouter.use(express.json());

// Public Stats
apiRouter.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await getInstituteStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch stats' });
  }
});

// Site Settings
apiRouter.get('/settings', async (_req: Request, res: Response) => {
  try {
    const settings = await getSiteSettingsMap();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch settings' });
  }
});

apiRouter.post('/settings', async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    if (!key || value === undefined) return res.status(400).json({ error: 'Missing key or value' });
    const updated = await updateSiteSetting(key, String(value));
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update setting' });
  }
});

// Categories
apiRouter.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch categories' });
  }
});

// Courses
apiRouter.get('/courses', async (req: Request, res: Response) => {
  try {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const isFree = req.query.isFree !== undefined ? req.query.isFree === 'true' : undefined;
    const difficulty = req.query.difficulty ? String(req.query.difficulty) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;

    const list = await getCourses({ categoryId, isFree, difficulty, search });
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch courses' });
  }
});

apiRouter.get('/courses/admin', async (_req: Request, res: Response) => {
  try {
    const list = await getAllCoursesAdmin();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch admin courses' });
  }
});

// Course Management (Create, Update, Delete)
apiRouter.post('/courses', async (req: Request, res: Response) => {
  try {
    const { title, categoryId } = req.body;
    if (!title || !categoryId) {
      return res.status(400).json({ error: 'Title and categoryId are required' });
    }
    const created = await createCourse(req.body);
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create course' });
  }
});

apiRouter.put('/courses/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid course ID' });
    const updated = await updateCourse(id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update course' });
  }
});

apiRouter.get('/courses/:id/safety', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid course ID' });
    const safety = await getCourseDeleteSafetyReport(id);
    if (!safety) return res.status(404).json({ error: 'Course not found' });
    res.json(safety);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to check course safety' });
  }
});

apiRouter.post('/courses/:id/archive', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid course ID' });
    const archived = await archiveCourse(id);
    res.json({ success: true, course: archived });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to archive course' });
  }
});

apiRouter.post('/courses/:id/restore', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid course ID' });
    const restored = await restoreCourse(id);
    res.json({ success: true, course: restored });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to restore course' });
  }
});

apiRouter.delete('/courses/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid course ID' });
    const force = req.query.force === 'true';
    const deleted = await deleteCourse(id, force);
    res.json({ success: true, deleted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete course' });
  }
});

apiRouter.get('/courses/:slug', async (req: Request, res: Response) => {
  try {
    const course = await getCourseBySlug(req.params.slug);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch course' });
  }
});

// Pricing Manager
apiRouter.patch('/courses/:id/pricing', async (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.id);
    const { isFree, price, discountedPrice } = req.body;
    const updated = await updateCoursePricing(
      courseId,
      Boolean(isFree),
      Number(price || 0),
      discountedPrice !== undefined ? Number(discountedPrice) : undefined
    );
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update pricing' });
  }
});

// Curriculum & Protected YouTube Lecture Manager
apiRouter.get('/courses/:id/curriculum', async (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.id);
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const userRole = req.query.userRole ? String(req.query.userRole) : undefined;

    const curriculumData = await getFullCurriculum(courseId, userId, userRole);
    if (!curriculumData) return res.status(404).json({ error: 'Course not found' });
    res.json(curriculumData);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch curriculum' });
  }
});

apiRouter.post('/courses/:id/modules', async (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.id);
    const { title, description, sequence } = req.body;
    if (!title) return res.status(400).json({ error: 'Module title is required' });
    const mod = await addCourseModule(courseId, title, description, sequence);
    res.json(mod);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add module' });
  }
});

apiRouter.post('/courses/:id/lessons', async (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.id);
    const { moduleId, title, youtubeUrl, duration, description, pdfResources, isPreview } = req.body;
    if (!moduleId || !title || !youtubeUrl) {
      return res.status(400).json({ error: 'Module ID, title, and YouTube URL are required' });
    }
    const lesson = await addCourseLesson({
      courseId,
      moduleId: Number(moduleId),
      title,
      youtubeUrl,
      duration,
      description,
      pdfResources: typeof pdfResources === 'string' ? pdfResources : JSON.stringify(pdfResources || []),
      isPreview: Boolean(isPreview),
    });
    res.json(lesson);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add lesson' });
  }
});

apiRouter.delete('/courses/:courseId/modules/:moduleId', async (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.courseId);
    const moduleId = Number(req.params.moduleId);
    if (isNaN(courseId) || isNaN(moduleId)) return res.status(400).json({ error: 'Invalid course or module ID' });
    const deleted = await deleteCourseModule(courseId, moduleId);
    res.json({ success: true, deleted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete course module' });
  }
});

apiRouter.delete('/courses/:courseId/lessons/:lessonId', async (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.courseId);
    const lessonId = Number(req.params.lessonId);
    if (isNaN(courseId) || isNaN(lessonId)) return res.status(400).json({ error: 'Invalid course or lesson ID' });
    const deleted = await deleteCourseLesson(courseId, lessonId);
    res.json({ success: true, deleted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete course lesson' });
  }
});

apiRouter.delete('/lessons/:id', async (req: Request, res: Response) => {
  try {
    const lessonId = Number(req.params.id);
    const courseId = req.query.courseId ? Number(req.query.courseId) : 1;
    const deleted = await deleteCourseLesson(courseId, lessonId);
    res.json({ success: true, deleted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete lesson' });
  }
});

// Quizzes & Assignments Delete
apiRouter.delete('/quizzes/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid quiz ID' });
    const deleted = await deleteQuiz(id);
    res.json({ success: true, deleted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete quiz' });
  }
});

apiRouter.delete('/assignments/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid assignment ID' });
    const deleted = await deleteAssignment(id);
    res.json({ success: true, deleted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete assignment' });
  }
});

apiRouter.post('/enroll/free', async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) return res.status(400).json({ error: 'Missing userId or courseId' });
    const result = await enrollStudentInCourse(Number(userId), Number(courseId), 'free');
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Enrollment failed' });
  }
});

apiRouter.get('/user/:userId/enrollments', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const enrollments = await getUserEnrollments(userId);
    res.json(enrollments);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch enrollments' });
  }
});

apiRouter.post('/enroll/progress', async (req: Request, res: Response) => {
  try {
    const { userId, courseId, lessonId } = req.body;
    if (!userId || !courseId || !lessonId) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    const updated = await updateLessonCompletion(Number(userId), Number(courseId), Number(lessonId));
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update progress' });
  }
});

// Payments
apiRouter.post('/payments', async (req: Request, res: Response) => {
  try {
    const { userId, courseId, originalPrice, discount, finalAmount, paymentMethod, providerReference, proofNotes } = req.body;
    if (!userId || !courseId) return res.status(400).json({ error: 'Missing required payment info' });

    const payment = await createPayment({
      userId: Number(userId),
      courseId: Number(courseId),
      originalPrice: Number(originalPrice || 0),
      discount: Number(discount || 0),
      finalAmount: Number(finalAmount || 0),
      paymentMethod: paymentMethod || 'Bank Transfer',
      providerReference,
      proofNotes,
    });
    res.json(payment);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Payment submission failed' });
  }
});

apiRouter.get('/payments/admin', async (_req: Request, res: Response) => {
  try {
    const list = await listPaymentsAdmin();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch payments' });
  }
});

apiRouter.patch('/payments/:id/status', async (req: Request, res: Response) => {
  try {
    const paymentId = Number(req.params.id);
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });
    const updated = await updatePaymentStatus(paymentId, status);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update payment status' });
  }
});

// Certificates
apiRouter.get('/user/:userId/certificates', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const certs = await getUserCertificates(userId);
    res.json(certs);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch certificates' });
  }
});

apiRouter.get('/certificates/verify/:code', async (req: Request, res: Response) => {
  try {
    const cert = await verifyCertificateByCode(req.params.code);
    if (!cert) return res.status(404).json({ valid: false, message: 'Certificate verification failed' });
    res.json({ valid: true, certificate: cert });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Verification error' });
  }
});

// Assignments & Submissions
apiRouter.get('/assignments/:courseId', async (req: Request, res: Response) => {
  try {
    const list = await getAssignmentsForCourse(Number(req.params.courseId));
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch assignments' });
  }
});

apiRouter.post('/assignments/:id/submit', async (req: Request, res: Response) => {
  try {
    const assignmentId = Number(req.params.id);
    const { studentId, submissionText, fileUrl } = req.body;
    if (!studentId || !submissionText) {
      return res.status(400).json({ error: 'Missing submission text or student ID' });
    }
    const sub = await submitStudentAssignment(assignmentId, Number(studentId), submissionText, fileUrl);
    res.json(sub);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit assignment' });
  }
});

apiRouter.get('/submissions/teacher', async (_req: Request, res: Response) => {
  try {
    const list = await listSubmissionsForTeacher();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch submissions' });
  }
});

apiRouter.post('/submissions/:id/grade', async (req: Request, res: Response) => {
  try {
    const submissionId = Number(req.params.id);
    const { marks, feedback } = req.body;
    const graded = await gradeSubmission(submissionId, Number(marks), feedback || '');
    res.json(graded);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to grade submission' });
  }
});

// Quizzes
apiRouter.get('/quizzes/:id', async (req: Request, res: Response) => {
  try {
    const quiz = await getQuizWithQuestions(Number(req.params.id));
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.json(quiz);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch quiz' });
  }
});

apiRouter.post('/quizzes/:id/attempt', async (req: Request, res: Response) => {
  try {
    const quizId = Number(req.params.id);
    const { studentId, answers } = req.body;
    if (!studentId || !answers) return res.status(400).json({ error: 'Missing student ID or answers' });
    const result = await submitQuizAttempt(quizId, Number(studentId), answers);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit quiz attempt' });
  }
});

// Coupons
apiRouter.post('/coupons/validate', async (req: Request, res: Response) => {
  try {
    const { code, originalAmount } = req.body;
    if (!code) return res.status(400).json({ error: 'Coupon code required' });
    const result = await validateCouponCode(code, Number(originalAmount || 0));
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Coupon validation failed' });
  }
});

// Reviews
apiRouter.get('/reviews', async (req: Request, res: Response) => {
  try {
    const courseId = req.query.courseId ? Number(req.query.courseId) : undefined;
    const list = await getApprovedReviews(courseId);
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch reviews' });
  }
});

// Users & Admin Control
apiRouter.get('/users/admin', async (_req: Request, res: Response) => {
  try {
    const list = await listAllUsers();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch users' });
  }
});

apiRouter.patch('/users/:id/role', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const { role } = req.body;
    if (!role) return res.status(400).json({ error: 'Role is required' });
    const updated = await updateUserRole(userId, role);
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update user role' });
  }
});

apiRouter.patch('/users/:id/status', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });
    const updated = await updateUserStatus(userId, status);
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update user status' });
  }
});

// Auth sync
apiRouter.post('/auth/sync', async (req: Request, res: Response) => {
  try {
    const { uid, email, fullName, profileImage, phoneNumber, country } = req.body;
    if (!uid || !email) return res.status(400).json({ error: 'UID and email required' });
    const user = await getOrCreateUser(uid, email, fullName, profileImage, phoneNumber, country);
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Auth sync failed' });
  }
});

// TEAM MEMBERS (Section 2 Requirement)
apiRouter.get('/team', async (req: Request, res: Response) => {
  try {
    const includeHidden = req.query.all === 'true';
    const list = await getTeamMembers(includeHidden);
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch team members' });
  }
});

apiRouter.post('/team', async (req: Request, res: Response) => {
  try {
    const { name, role, image, bio, order, isVisible, specialization } = req.body;
    if (!name || !role || !image || !bio) {
      return res.status(400).json({ error: 'Name, role, image, and bio are required' });
    }
    const created = await createTeamMember({
      name,
      role,
      image,
      bio,
      order: order ? Number(order) : 1,
      isVisible: isVisible !== false,
      specialization,
    });
    res.json(created[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create team member' });
  }
});

apiRouter.put('/team/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await updateTeamMember(id, req.body);
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update team member' });
  }
});

apiRouter.delete('/team/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteTeamMember(id);
    res.json({ success: true, deleted: deleted[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete team member' });
  }
});

// COURSE RESOURCES & TEMPLATES (Section 8 Requirement)
apiRouter.get('/courses/:courseId/resources', async (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.courseId);
    const resources = await getCourseResources(courseId);
    res.json(resources);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch course resources' });
  }
});

apiRouter.post('/courses/:courseId/resources', async (req: Request, res: Response) => {
  try {
    const courseId = Number(req.params.courseId);
    const { title, description, fileType, fileUrl, fileSize, isProtected, lessonId } = req.body;
    if (!title || !fileUrl) {
      return res.status(400).json({ error: 'Title and fileUrl are required' });
    }
    const created = await createCourseResource({
      courseId,
      lessonId: lessonId ? Number(lessonId) : undefined,
      title,
      description,
      fileType: fileType || 'PDF',
      fileUrl,
      fileSize: fileSize || '2.4 MB',
      isProtected: isProtected !== false,
    });
    res.json(created[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create course resource' });
  }
});

apiRouter.delete('/resources/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteCourseResource(id);
    res.json({ success: true, deleted: deleted[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete course resource' });
  }
});

// CATEGORIES CRUD (Section 5 Requirement)
apiRouter.post('/categories', async (req: Request, res: Response) => {
  try {
    const { name, slug, icon, description } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'Name and slug are required' });
    const created = await createCategory({ name, slug, icon, description });
    res.json(created[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create category' });
  }
});

apiRouter.put('/categories/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await updateCategory(id, req.body);
    res.json(updated[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update category' });
  }
});

apiRouter.delete('/categories/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteCategory(id);
    res.json({ success: true, deleted: deleted[0] });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete category' });
  }
});

// USER DELETION (Safe & Soft Delete)
apiRouter.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });
    const soft = req.query.soft !== 'false';
    const result = await deleteUser(id, soft);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete user' });
  }
});

// REVIEWS & TESTIMONIALS ADMIN
apiRouter.get('/reviews/admin', async (_req: Request, res: Response) => {
  try {
    const list = await getAllReviewsAdmin();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch admin reviews' });
  }
});

apiRouter.patch('/reviews/:id/status', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { isApproved } = req.body;
    const updated = await updateReviewStatus(id, Boolean(isApproved));
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update review status' });
  }
});

apiRouter.delete('/reviews/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteReview(id);
    res.json({ success: true, deleted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete review' });
  }
});

// ANNOUNCEMENTS
apiRouter.get('/announcements', async (req: Request, res: Response) => {
  try {
    const role = req.query.role ? String(req.query.role) : 'all';
    const list = await getAnnouncements(role);
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch announcements' });
  }
});

apiRouter.post('/announcements', async (req: Request, res: Response) => {
  try {
    const { title, content, targetRole, courseId, createdBy } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content required' });
    const created = await createAnnouncement({ title, content, targetRole, courseId, createdBy });
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create announcement' });
  }
});

apiRouter.delete('/announcements/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteAnnouncement(id);
    res.json({ success: true, deleted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete announcement' });
  }
});

// SUPPORT TICKETS & CONTACT MESSAGES
apiRouter.get('/support-tickets', async (_req: Request, res: Response) => {
  try {
    const list = await getSupportTickets();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch support tickets' });
  }
});

apiRouter.post('/support-tickets', async (req: Request, res: Response) => {
  try {
    const { studentName, email, subject, message, userId, priority } = req.body;
    if (!studentName || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    const created = await createSupportTicket({ studentName, email, subject: subject || 'General Inquiry', message, userId, priority });
    res.json(created[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit contact message' });
  }
});

apiRouter.patch('/support-tickets/:id/status', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { status, response } = req.body;
    const updated = await updateSupportTicketStatus(id, status, response);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update ticket' });
  }
});

apiRouter.delete('/support-tickets/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteSupportTicket(id);
    res.json({ success: true, deleted });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete ticket' });
  }
});

// AUDIT LOGS
apiRouter.get('/audit-logs', async (_req: Request, res: Response) => {
  try {
    const logs = await getAuditLogs(50);
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch audit logs' });
  }
});


