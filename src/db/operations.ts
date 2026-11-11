import { db } from './index.ts';
import {
  users,
  courseCategories,
  courses,
  courseModules,
  lessons,
  enrollments,
  payments,
  assignments,
  submissions,
  quizzes,
  quizQuestions,
  quizAttempts,
  certificates,
  coupons,
  reviews,
  supportTickets,
  announcements,
  adminAuditLogs,
  siteSettings,
  teamMembers,
  courseResources,
} from './schema.ts';
import { eq, desc, asc, and, sql } from 'drizzle-orm';

// USER OPERATIONS
export async function getOrCreateUser(
  uid: string,
  email: string,
  fullName?: string,
  profileImage?: string,
  phoneNumber?: string,
  country?: string
) {
  try {
    const isOwner = email.toLowerCase() === 'zohaibalioffical12@gmail.com';
    const role = isOwner ? 'super_admin' : 'student';

    const existing = await db.select().from(users).where(eq(users.uid, uid));
    if (existing.length > 0) {
      if (isOwner && existing[0].role !== 'super_admin') {
        const updated = await db
          .update(users)
          .set({ role: 'super_admin' })
          .where(eq(users.id, existing[0].id))
          .returning();
        return updated[0];
      }
      return existing[0];
    }

    const inserted = await db
      .insert(users)
      .values({
        uid,
        email,
        fullName: fullName || (isOwner ? 'Zohaib Ali (Founder)' : 'Student User'),
        profileImage: profileImage || null,
        phoneNumber: phoneNumber || null,
        country: country || 'Pakistan',
        role,
        status: 'active',
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('getOrCreateUser error:', error);
    throw new Error('Failed to process user authentication', { cause: error });
  }
}

export async function listAllUsers() {
  try {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  } catch (error) {
    console.error('listAllUsers error:', error);
    throw new Error('Failed to fetch users', { cause: error });
  }
}

export async function updateUserRole(userId: number, role: string) {
  try {
    return await db.update(users).set({ role }).where(eq(users.id, userId)).returning();
  } catch (error) {
    console.error('updateUserRole error:', error);
    throw new Error('Failed to update user role', { cause: error });
  }
}

export async function updateUserStatus(userId: number, status: string) {
  try {
    return await db.update(users).set({ status }).where(eq(users.id, userId)).returning();
  } catch (error) {
    console.error('updateUserStatus error:', error);
    throw new Error('Failed to update user status', { cause: error });
  }
}

// REAL DYNAMIC STATS (Zero fake stats)
export async function getInstituteStats() {
  try {
    const totalStudentsRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, 'student'));

    const totalCoursesRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(courses)
      .where(eq(courses.isPublished, true));

    const totalTeachersRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, 'teacher'));

    const totalCompletedRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(enrollments)
      .where(eq(enrollments.status, 'completed'));

    const totalEnrollmentsRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(enrollments);

    const verifiedRevenueRes = await db
      .select({ total: sql<number>`coalesce(sum(final_amount), 0)` })
      .from(payments)
      .where(eq(payments.paymentStatus, 'Successful'));

    return {
      totalStudents: Number(totalStudentsRes[0]?.count || 0),
      totalCourses: Number(totalCoursesRes[0]?.count || 0),
      totalTeachers: Number(totalTeachersRes[0]?.count || 0) + 1, // +1 for founder instructor
      totalCompleted: Number(totalCompletedRes[0]?.count || 0),
      totalEnrollments: Number(totalEnrollmentsRes[0]?.count || 0),
      verifiedRevenuePKR: Number(verifiedRevenueRes[0]?.total || 0),
    };
  } catch (error) {
    console.error('getInstituteStats error:', error);
    throw new Error('Failed to load institute metrics', { cause: error });
  }
}

// CATEGORIES
export async function getCategories() {
  try {
    return await db.select().from(courseCategories).orderBy(asc(courseCategories.name));
  } catch (error) {
    console.error('getCategories error:', error);
    throw new Error('Failed to load categories', { cause: error });
  }
}

// COURSES
export async function getCourses(filters?: {
  categoryId?: number;
  isFree?: boolean;
  difficulty?: string;
  search?: string;
}) {
  try {
    const conditions = [eq(courses.isPublished, true)];

    if (filters?.categoryId) {
      conditions.push(eq(courses.categoryId, filters.categoryId));
    }
    if (filters?.isFree !== undefined) {
      conditions.push(eq(courses.isFree, filters.isFree));
    }
    if (filters?.difficulty) {
      conditions.push(eq(courses.difficulty, filters.difficulty));
    }

    const result = await db
      .select({
        course: courses,
        category: courseCategories,
        instructor: {
          id: users.id,
          fullName: users.fullName,
          profileImage: users.profileImage,
          bio: users.bio,
        },
      })
      .from(courses)
      .leftJoin(courseCategories, eq(courses.categoryId, courseCategories.id))
      .leftJoin(users, eq(courses.instructorId, users.id))
      .where(and(...conditions))
      .orderBy(desc(courses.createdAt));

    return result.map((r) => ({
      ...r.course,
      categoryName: r.category?.name || 'General',
      categorySlug: r.category?.slug || 'general',
      instructor: r.instructor,
    }));
  } catch (error) {
    console.error('getCourses error:', error);
    throw new Error('Failed to load courses', { cause: error });
  }
}

export async function getAllCoursesAdmin() {
  try {
    const result = await db
      .select({
        course: courses,
        category: courseCategories,
        instructor: {
          id: users.id,
          fullName: users.fullName,
          email: users.email,
        },
      })
      .from(courses)
      .leftJoin(courseCategories, eq(courses.categoryId, courseCategories.id))
      .leftJoin(users, eq(courses.instructorId, users.id))
      .orderBy(desc(courses.createdAt));

    return result.map((r) => ({
      ...r.course,
      categoryName: r.category?.name || 'General',
      instructorName: r.instructor?.fullName || 'Zohaib Ali',
    }));
  } catch (error) {
    console.error('getAllCoursesAdmin error:', error);
    throw new Error('Failed to load admin courses', { cause: error });
  }
}

export async function getCourseBySlug(slug: string) {
  try {
    const result = await db
      .select({
        course: courses,
        category: courseCategories,
        instructor: {
          id: users.id,
          fullName: users.fullName,
          email: users.email,
          profileImage: users.profileImage,
          bio: users.bio,
        },
      })
      .from(courses)
      .leftJoin(courseCategories, eq(courses.categoryId, courseCategories.id))
      .leftJoin(users, eq(courses.instructorId, users.id))
      .where(eq(courses.slug, slug))
      .limit(1);

    if (result.length === 0) return null;

    const courseData = result[0].course;

    // Load modules and lessons for this course
    const modulesList = await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.courseId, courseData.id))
      .orderBy(asc(courseModules.sequence));

    const lessonsList = await db
      .select()
      .from(lessons)
      .where(and(eq(lessons.courseId, courseData.id), eq(lessons.isPublished, true)))
      .orderBy(asc(lessons.sequence));

    const modulesWithLessons = modulesList.map((m) => ({
      ...m,
      lessons: lessonsList
        .filter((l) => l.moduleId === m.id)
        .map((l) => ({
          ...l,
          // Hide full video URL for non-enrolled visitors unless it is marked as preview
          youtubeUrl: l.isPreview ? l.youtubeUrl : null,
        })),
    }));

    return {
      ...courseData,
      categoryName: result[0].category?.name || 'Technology',
      instructor: result[0].instructor,
      curriculum: modulesWithLessons,
    };
  } catch (error) {
    console.error('getCourseBySlug error:', error);
    throw new Error('Failed to load course details', { cause: error });
  }
}

// PRICING CONTROL MANAGER (Critical Super Admin Requirement)
export async function updateCoursePricing(
  courseId: number,
  isFree: boolean,
  price: number,
  discountedPrice?: number
) {
  try {
    const finalPrice = isFree ? 0 : Math.max(0, price);
    const finalDiscountedPrice = isFree ? 0 : Math.max(0, discountedPrice || 0);

    const updated = await db
      .update(courses)
      .set({
        isFree,
        price: finalPrice,
        discountedPrice: finalDiscountedPrice,
      })
      .where(eq(courses.id, courseId))
      .returning();

    return updated[0];
  } catch (error) {
    console.error('updateCoursePricing error:', error);
    throw new Error('Failed to update course pricing', { cause: error });
  }
}

// COURSE CRUD (Super Admin Course Management)
export async function createCourse(data: {
  title: string;
  slug?: string;
  description: string;
  categoryId: number;
  instructorId?: number;
  thumbnail?: string;
  isFree?: boolean;
  price?: number;
  discountedPrice?: number;
  difficulty?: string;
  duration?: string;
  certificateEligible?: boolean;
  learningOutcomes?: string[] | string;
  prerequisites?: string[] | string;
  isPublished?: boolean;
}) {
  try {
    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + `-${Date.now().toString(36)}`;

    const isFree = Boolean(data.isFree);
    const price = isFree ? 0 : Number(data.price) || 0;
    const discountedPrice = isFree ? 0 : Number(data.discountedPrice) || 0;

    const inserted = await db
      .insert(courses)
      .values({
        title: data.title,
        slug,
        description: data.description,
        categoryId: Number(data.categoryId),
        instructorId: data.instructorId ? Number(data.instructorId) : 1,
        thumbnail:
          data.thumbnail ||
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
        isFree,
        price,
        discountedPrice,
        difficulty: data.difficulty || 'All Levels',
        duration: data.duration || '8 Weeks',
        certificateEligible: data.certificateEligible !== false,
        learningObjectives:
          typeof (data as any).learningObjectives === 'string'
            ? (data as any).learningObjectives
            : typeof data.learningOutcomes === 'string'
            ? data.learningOutcomes
            : JSON.stringify(data.learningOutcomes || []),
        prerequisites:
          typeof data.prerequisites === 'string'
            ? data.prerequisites
            : JSON.stringify(data.prerequisites || []),
        isPublished: data.isPublished !== false,
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('createCourse error:', error);
    throw new Error('Failed to create course', { cause: error });
  }
}

export async function updateCourse(
  id: number,
  data: Partial<{
    title: string;
    slug: string;
    description: string;
    categoryId: number;
    instructorId: number;
    thumbnail: string;
    isFree: boolean;
    price: number;
    discountedPrice: number;
    difficulty: string;
    duration: string;
    certificateEligible: boolean;
    learningOutcomes: string[] | string;
    learningObjectives: string[] | string;
    prerequisites: string[] | string;
    isPublished: boolean;
  }>
) {
  try {
    const updateValues: any = {};
    if (data.title !== undefined) updateValues.title = data.title;
    if (data.slug !== undefined) updateValues.slug = data.slug;
    if (data.description !== undefined) updateValues.description = data.description;
    if (data.categoryId !== undefined) updateValues.categoryId = Number(data.categoryId);
    if (data.instructorId !== undefined) updateValues.instructorId = Number(data.instructorId);
    if (data.thumbnail !== undefined) updateValues.thumbnail = data.thumbnail;
    if (data.isFree !== undefined) {
      updateValues.isFree = Boolean(data.isFree);
      if (updateValues.isFree) {
        updateValues.price = 0;
        updateValues.discountedPrice = 0;
      }
    }
    if (data.price !== undefined && !updateValues.isFree) {
      updateValues.price = Number(data.price);
    }
    if (data.discountedPrice !== undefined && !updateValues.isFree) {
      updateValues.discountedPrice = Number(data.discountedPrice);
    }
    if (data.difficulty !== undefined) updateValues.difficulty = data.difficulty;
    if (data.duration !== undefined) updateValues.duration = data.duration;
    if (data.certificateEligible !== undefined) updateValues.certificateEligible = Boolean(data.certificateEligible);
    if (data.isPublished !== undefined) updateValues.isPublished = Boolean(data.isPublished);

    const outcomes = data.learningObjectives !== undefined ? data.learningObjectives : data.learningOutcomes;
    if (outcomes !== undefined) {
      updateValues.learningObjectives =
        typeof outcomes === 'string'
          ? outcomes
          : JSON.stringify(outcomes);
    }
    if (data.prerequisites !== undefined) {
      updateValues.prerequisites =
        typeof data.prerequisites === 'string'
          ? data.prerequisites
          : JSON.stringify(data.prerequisites);
    }

    const updated = await db
      .update(courses)
      .set(updateValues)
      .where(eq(courses.id, id))
      .returning();

    return updated[0];
  } catch (error) {
    console.error('updateCourse error:', error);
    throw new Error('Failed to update course', { cause: error });
  }
}

export async function getCourseDeleteSafetyReport(id: number) {
  try {
    const course = await db.select().from(courses).where(eq(courses.id, id));
    if (course.length === 0) return null;

    const certsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(certificates)
      .where(eq(certificates.courseId, id));

    const paymentsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(payments)
      .where(eq(payments.courseId, id));

    const enrollmentsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(enrollments)
      .where(eq(enrollments.courseId, id));

    const lessonsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(lessons)
      .where(eq(lessons.courseId, id));

    const assignmentsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(assignments)
      .where(eq(assignments.courseId, id));

    const quizzesCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(quizzes)
      .where(eq(quizzes.courseId, id));

    return {
      course: course[0],
      certificatesCount: Number(certsCount[0]?.count || 0),
      paymentsCount: Number(paymentsCount[0]?.count || 0),
      enrollmentsCount: Number(enrollmentsCount[0]?.count || 0),
      lessonsCount: Number(lessonsCount[0]?.count || 0),
      assignmentsCount: Number(assignmentsCount[0]?.count || 0),
      quizzesCount: Number(quizzesCount[0]?.count || 0),
      hasSensitiveHistoricalData: Number(certsCount[0]?.count || 0) > 0 || Number(paymentsCount[0]?.count || 0) > 0,
    };
  } catch (error) {
    console.error('getCourseDeleteSafetyReport error:', error);
    throw new Error('Failed to generate course safety report', { cause: error });
  }
}

export async function archiveCourse(id: number) {
  try {
    const updated = await db
      .update(courses)
      .set({ isPublished: false })
      .where(eq(courses.id, id))
      .returning();

    await createAuditLog('ARCHIVE_COURSE', `Course ID ${id}`, `Archived course: ${updated[0]?.title || id}`);
    return updated[0];
  } catch (error) {
    console.error('archiveCourse error:', error);
    throw new Error('Failed to archive course', { cause: error });
  }
}

export async function restoreCourse(id: number) {
  try {
    const updated = await db
      .update(courses)
      .set({ isPublished: true })
      .where(eq(courses.id, id))
      .returning();

    await createAuditLog('RESTORE_COURSE', `Course ID ${id}`, `Restored course: ${updated[0]?.title || id}`);
    return updated[0];
  } catch (error) {
    console.error('restoreCourse error:', error);
    throw new Error('Failed to restore course', { cause: error });
  }
}

export async function deleteCourse(id: number, force: boolean = false) {
  try {
    const safety = await getCourseDeleteSafetyReport(id);
    if (!safety) {
      throw new Error(`Course with ID ${id} was not found`);
    }

    if (safety.hasSensitiveHistoricalData && !force) {
      throw new Error(
        `This course has ${safety.certificatesCount} issued certificates and ${safety.paymentsCount} recorded payments. Use 'Archive' to preserve student credentials, or confirm permanent deletion.`
      );
    }

    // 1. Delete course resources
    await db.delete(courseResources).where(eq(courseResources.courseId, id));

    // 2. Delete quiz attempts and questions for quizzes of this course
    const courseQuizzes = await db
      .select({ id: quizzes.id })
      .from(quizzes)
      .where(eq(quizzes.courseId, id));
    for (const q of courseQuizzes) {
      await db.delete(quizAttempts).where(eq(quizAttempts.quizId, q.id));
      await db.delete(quizQuestions).where(eq(quizQuestions.quizId, q.id));
    }
    await db.delete(quizzes).where(eq(quizzes.courseId, id));

    // 3. Delete submissions for assignments of this course
    const courseAssignments = await db
      .select({ id: assignments.id })
      .from(assignments)
      .where(eq(assignments.courseId, id));
    for (const a of courseAssignments) {
      await db.delete(submissions).where(eq(submissions.assignmentId, a.id));
    }
    await db.delete(assignments).where(eq(assignments.courseId, id));

    // 4. Delete enrollments, payments, reviews, certificates
    await db.delete(enrollments).where(eq(enrollments.courseId, id));
    await db.delete(payments).where(eq(payments.courseId, id));
    await db.delete(reviews).where(eq(reviews.courseId, id));
    await db.delete(certificates).where(eq(certificates.courseId, id));

    // 5. Delete lessons and modules
    await db.delete(lessons).where(eq(lessons.courseId, id));
    await db.delete(courseModules).where(eq(courseModules.courseId, id));

    // 6. Delete the course record
    const deleted = await db.delete(courses).where(eq(courses.id, id)).returning();
    await createAuditLog('PERMANENT_DELETE_COURSE', `Course ID ${id}`, `Deleted course: ${safety.course.title}`);
    return deleted[0];
  } catch (error: any) {
    console.error('deleteCourse error:', error);
    throw new Error(error.message || 'Failed to delete course', { cause: error });
  }
}

// YOUTUBE LECTURE & MODULE MANAGER
export async function getFullCurriculum(courseId: number, userId?: number, userRole?: string) {
  try {
    // Check if user is authorized (Super Admin, Teacher, or Enrolled Student)
    let isAuthorized = userRole === 'super_admin' || userRole === 'teacher';

    if (!isAuthorized && userId) {
      const enrollment = await db
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.courseId, courseId),
            eq(enrollments.userId, userId),
            eq(enrollments.status, 'active')
          )
        );
      if (enrollment.length > 0) {
        isAuthorized = true;
      }
    }

    const courseData = await db.select().from(courses).where(eq(courses.id, courseId));
    if (courseData.length === 0) return null;

    const modulesList = await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .orderBy(asc(courseModules.sequence));

    const lessonsList = await db
      .select()
      .from(lessons)
      .where(eq(lessons.courseId, courseId))
      .orderBy(asc(lessons.sequence));

    const curriculum = modulesList.map((m) => ({
      ...m,
      lessons: lessonsList
        .filter((l) => l.moduleId === m.id)
        .map((l) => ({
          ...l,
          // Protected YouTube link: Only authorized students or preview lessons get the actual YouTube URL
          youtubeUrl: isAuthorized || l.isPreview ? l.youtubeUrl : '',
          isLocked: !isAuthorized && !l.isPreview,
        })),
    }));

    return {
      course: courseData[0],
      curriculum,
      isAuthorized,
    };
  } catch (error) {
    console.error('getFullCurriculum error:', error);
    throw new Error('Failed to load curriculum', { cause: error });
  }
}

export async function addCourseModule(courseId: number, title: string, description?: string, sequence?: number) {
  try {
    const countRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId));
    const nextSeq = sequence || Number(countRes[0]?.count || 0) + 1;

    const mod = await db
      .insert(courseModules)
      .values({
        courseId,
        title,
        description: description || '',
        sequence: nextSeq,
      })
      .returning();

    await db
      .update(courses)
      .set({ modulesCount: sql`modules_count + 1` })
      .where(eq(courses.id, courseId));

    return mod[0];
  } catch (error) {
    console.error('addCourseModule error:', error);
    throw new Error('Failed to add module', { cause: error });
  }
}

export async function addCourseLesson(data: {
  courseId: number;
  moduleId: number;
  title: string;
  youtubeUrl: string;
  duration?: string;
  description?: string;
  pdfResources?: string;
  isPreview?: boolean;
}) {
  try {
    const countRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(lessons)
      .where(eq(lessons.moduleId, data.moduleId));
    const nextSeq = Number(countRes[0]?.count || 0) + 1;

    const lesson = await db
      .insert(lessons)
      .values({
        courseId: data.courseId,
        moduleId: data.moduleId,
        title: data.title,
        youtubeUrl: data.youtubeUrl,
        duration: data.duration || '20 mins',
        sequence: nextSeq,
        description: data.description || '',
        pdfResources: data.pdfResources || '[]',
        isPublished: true,
        isPreview: data.isPreview || false,
      })
      .returning();

    await db
      .update(courses)
      .set({ lecturesCount: sql`lectures_count + 1` })
      .where(eq(courses.id, data.courseId));

    return lesson[0];
  } catch (error) {
    console.error('addCourseLesson error:', error);
    throw new Error('Failed to add lecture', { cause: error });
  }
}

// ENROLLMENTS & PROGRESS
export async function enrollStudentInCourse(userId: number, courseId: number, enrollmentType: 'free' | 'paid') {
  try {
    // Check if already enrolled
    const existing = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));

    if (existing.length > 0) {
      return { success: true, enrollment: existing[0], message: 'Already enrolled' };
    }

    const inserted = await db
      .insert(enrollments)
      .values({
        userId,
        courseId,
        enrollmentType,
        status: 'active',
        progressPercent: 0,
        completedLessons: '[]',
      })
      .returning();

    await db
      .update(courses)
      .set({ enrollmentCount: sql`enrollment_count + 1` })
      .where(eq(courses.id, courseId));

    return { success: true, enrollment: inserted[0], message: 'Enrolled successfully' };
  } catch (error) {
    console.error('enrollStudentInCourse error:', error);
    throw new Error('Failed to process enrollment', { cause: error });
  }
}

export async function getUserEnrollments(userId: number) {
  try {
    const list = await db
      .select({
        enrollment: enrollments,
        course: courses,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));

    return list.map((r) => ({
      ...r.enrollment,
      course: r.course,
    }));
  } catch (error) {
    console.error('getUserEnrollments error:', error);
    throw new Error('Failed to load user enrollments', { cause: error });
  }
}

export async function updateLessonCompletion(userId: number, courseId: number, lessonId: number) {
  try {
    const enrollment = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));

    if (enrollment.length === 0) {
      throw new Error('Enrollment not found');
    }

    const currentEnrollment = enrollment[0];
    let completed: number[] = [];
    try {
      completed = JSON.parse(currentEnrollment.completedLessons || '[]');
    } catch {
      completed = [];
    }

    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
    }

    // Calculate total lessons in course
    const totalLessonsRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(lessons)
      .where(and(eq(lessons.courseId, courseId), eq(lessons.isPublished, true)));

    const total = Math.max(1, Number(totalLessonsRes[0]?.count || 1));
    const percent = Math.min(100, Math.round((completed.length / total) * 100));
    const isCompleted = percent >= 100;

    const updated = await db
      .update(enrollments)
      .set({
        completedLessons: JSON.stringify(completed),
        progressPercent: percent,
        status: isCompleted ? 'completed' : 'active',
        completedAt: isCompleted ? new Date() : null,
      })
      .where(eq(enrollments.id, currentEnrollment.id))
      .returning();

    // Auto issue certificate if 100% completed and eligible
    if (isCompleted) {
      const courseData = await db.select().from(courses).where(eq(courses.id, courseId));
      const userData = await db.select().from(users).where(eq(users.id, userId));
      if (courseData[0]?.certificateEligible && userData[0]) {
        await issueCertificateInternal(userId, courseId, userData[0].fullName, courseData[0].title);
      }
    }

    return updated[0];
  } catch (error) {
    console.error('updateLessonCompletion error:', error);
    throw new Error('Failed to update progress', { cause: error });
  }
}

// PAYMENTS
export async function createPayment(data: {
  userId: number;
  courseId: number;
  originalPrice: number;
  discount: number;
  finalAmount: number;
  paymentMethod: string;
  providerReference?: string;
  proofNotes?: string;
}) {
  try {
    const txId = `ZA-TX-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await db
      .insert(payments)
      .values({
        transactionId: txId,
        userId: data.userId,
        courseId: data.courseId,
        originalPrice: data.originalPrice,
        discount: data.discount,
        finalAmount: data.finalAmount,
        paymentMethod: data.paymentMethod,
        paymentStatus: 'Under Review',
        providerReference: data.providerReference || null,
        proofNotes: data.proofNotes || null,
      })
      .returning();

    return payment[0];
  } catch (error) {
    console.error('createPayment error:', error);
    throw new Error('Failed to record payment', { cause: error });
  }
}

export async function listPaymentsAdmin() {
  try {
    const list = await db
      .select({
        payment: payments,
        user: {
          id: users.id,
          fullName: users.fullName,
          email: users.email,
          phoneNumber: users.phoneNumber,
        },
        course: {
          id: courses.id,
          title: courses.title,
          price: courses.price,
        },
      })
      .from(payments)
      .leftJoin(users, eq(payments.userId, users.id))
      .leftJoin(courses, eq(payments.courseId, courses.id))
      .orderBy(desc(payments.paymentDate));

    return list.map((item) => ({
      ...item.payment,
      studentName: item.user?.fullName || 'Student',
      studentEmail: item.user?.email || '',
      studentPhone: item.user?.phoneNumber || '',
      courseTitle: item.course?.title || 'Course',
    }));
  } catch (error) {
    console.error('listPaymentsAdmin error:', error);
    throw new Error('Failed to load payments', { cause: error });
  }
}

export async function updatePaymentStatus(paymentId: number, status: string) {
  try {
    const payment = await db
      .update(payments)
      .set({ paymentStatus: status })
      .where(eq(payments.id, paymentId))
      .returning();

    if (payment.length > 0 && status === 'Successful') {
      // Automatically activate enrollment!
      await enrollStudentInCourse(payment[0].userId, payment[0].courseId, 'paid');
    }

    return payment[0];
  } catch (error) {
    console.error('updatePaymentStatus error:', error);
    throw new Error('Failed to update payment status', { cause: error });
  }
}

// CERTIFICATES
export async function issueCertificateInternal(
  userId: number,
  courseId: number,
  studentName: string,
  courseTitle: string
) {
  try {
    const existing = await db
      .select()
      .from(certificates)
      .where(and(eq(certificates.userId, userId), eq(certificates.courseId, courseId)));

    if (existing.length > 0) return existing[0];

    const certId = `ZA-CERT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const verifyCode = `ZA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(verifyCode)}`;

    const cert = await db
      .insert(certificates)
      .values({
        certificateId: certId,
        userId,
        courseId,
        studentName,
        courseTitle,
        issueDate: new Date().toISOString().split('T')[0],
        verificationCode: verifyCode,
        qrCodeUrl: qrUrl,
        issuer: 'Zohaib Ali — Founder & Owner',
      })
      .returning();

    return cert[0];
  } catch (error) {
    console.error('issueCertificateInternal error:', error);
    throw new Error('Failed to issue certificate', { cause: error });
  }
}

export async function verifyCertificateByCode(code: string) {
  try {
    const cert = await db
      .select()
      .from(certificates)
      .where(eq(certificates.verificationCode, code.trim().toUpperCase()));
    return cert[0] || null;
  } catch (error) {
    console.error('verifyCertificateByCode error:', error);
    throw new Error('Failed to verify certificate', { cause: error });
  }
}

export async function getUserCertificates(userId: number) {
  try {
    return await db.select().from(certificates).where(eq(certificates.userId, userId));
  } catch (error) {
    console.error('getUserCertificates error:', error);
    throw new Error('Failed to load certificates', { cause: error });
  }
}

// ASSIGNMENTS & SUBMISSIONS
export async function getAssignmentsForCourse(courseId: number) {
  try {
    return await db.select().from(assignments).where(eq(assignments.courseId, courseId));
  } catch (error) {
    console.error('getAssignmentsForCourse error:', error);
    throw new Error('Failed to load assignments', { cause: error });
  }
}

export async function submitStudentAssignment(
  assignmentId: number,
  studentId: number,
  submissionText: string,
  fileUrl?: string
) {
  try {
    const sub = await db
      .insert(submissions)
      .values({
        assignmentId,
        studentId,
        submissionText,
        fileUrl: fileUrl || null,
        status: 'submitted',
      })
      .returning();
    return sub[0];
  } catch (error) {
    console.error('submitStudentAssignment error:', error);
    throw new Error('Failed to submit assignment', { cause: error });
  }
}

export async function listSubmissionsForTeacher() {
  try {
    const list = await db
      .select({
        submission: submissions,
        assignment: assignments,
        student: {
          id: users.id,
          fullName: users.fullName,
          email: users.email,
        },
      })
      .from(submissions)
      .leftJoin(assignments, eq(submissions.assignmentId, assignments.id))
      .leftJoin(users, eq(submissions.studentId, users.id))
      .orderBy(desc(submissions.submittedAt));

    return list.map((item) => ({
      ...item.submission,
      assignmentTitle: item.assignment?.title || 'Assignment',
      totalMarks: item.assignment?.totalMarks || 100,
      studentName: item.student?.fullName || 'Student',
      studentEmail: item.student?.email || '',
    }));
  } catch (error) {
    console.error('listSubmissionsForTeacher error:', error);
    throw new Error('Failed to list submissions', { cause: error });
  }
}

export async function gradeSubmission(submissionId: number, marks: number, feedback: string) {
  try {
    const graded = await db
      .update(submissions)
      .set({
        marks,
        feedback,
        status: 'graded',
        gradedAt: new Date(),
      })
      .where(eq(submissions.id, submissionId))
      .returning();
    return graded[0];
  } catch (error) {
    console.error('gradeSubmission error:', error);
    throw new Error('Failed to grade submission', { cause: error });
  }
}

// QUIZZES
export async function getQuizWithQuestions(quizId: number) {
  try {
    const quiz = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
    if (quiz.length === 0) return null;

    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(asc(quizQuestions.sequence));

    return {
      ...quiz[0],
      questions: questions.map((q) => {
        let optionsArr: string[] = [];
        try {
          optionsArr = JSON.parse(q.options || '[]');
        } catch {
          optionsArr = [];
        }
        return {
          id: q.id,
          questionText: q.questionText,
          questionType: q.questionType,
          options: optionsArr,
          explanation: q.explanation,
        };
      }),
    };
  } catch (error) {
    console.error('getQuizWithQuestions error:', error);
    throw new Error('Failed to load quiz', { cause: error });
  }
}

export async function submitQuizAttempt(
  quizId: number,
  studentId: number,
  userAnswers: Record<number, string>
) {
  try {
    const questions = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quizId));
    const quiz = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
    if (quiz.length === 0 || questions.length === 0) throw new Error('Quiz not found');

    let correctCount = 0;
    questions.forEach((q) => {
      const studentAns = userAnswers[q.id]?.trim().toLowerCase();
      const actualAns = q.correctAnswer?.trim().toLowerCase();
      if (studentAns === actualAns) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= (quiz[0].passingMarks || 70);

    const attempt = await db
      .insert(quizAttempts)
      .values({
        quizId,
        studentId,
        score,
        passed,
        answers: JSON.stringify(userAnswers),
      })
      .returning();

    return {
      attempt: attempt[0],
      score,
      passed,
      totalQuestions: questions.length,
      correctCount,
    };
  } catch (error) {
    console.error('submitQuizAttempt error:', error);
    throw new Error('Failed to submit quiz attempt', { cause: error });
  }
}

// SITE SETTINGS
export async function getSiteSettingsMap() {
  try {
    const list = await db.select().from(siteSettings);
    const map: Record<string, string> = {};
    list.forEach((s) => {
      map[s.key] = s.value;
    });
    return map;
  } catch (error) {
    console.error('getSiteSettingsMap error:', error);
    throw new Error('Failed to load site settings', { cause: error });
  }
}

export async function updateSiteSetting(key: string, value: string) {
  try {
    return await db
      .insert(siteSettings)
      .values({ key, value, description: 'Updated via Admin Center' })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, updatedAt: new Date() },
      })
      .returning();
  } catch (error) {
    console.error('updateSiteSetting error:', error);
    throw new Error('Failed to update site setting', { cause: error });
  }
}

// REVIEWS
export async function getApprovedReviews(courseId?: number) {
  try {
    const conditions = [eq(reviews.isApproved, true)];
    if (courseId) conditions.push(eq(reviews.courseId, courseId));

    const list = await db
      .select({
        review: reviews,
        student: {
          fullName: users.fullName,
          profileImage: users.profileImage,
        },
        course: {
          title: courses.title,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.studentId, users.id))
      .leftJoin(courses, eq(reviews.courseId, courses.id))
      .where(and(...conditions))
      .orderBy(desc(reviews.createdAt));

    return list.map((r) => ({
      ...r.review,
      studentName: r.student?.fullName || 'Verified Student',
      studentPhoto: r.student?.profileImage,
      courseTitle: r.course?.title || '',
    }));
  } catch (error) {
    console.error('getApprovedReviews error:', error);
    throw new Error('Failed to load reviews', { cause: error });
  }
}

// COUPONS
export async function validateCouponCode(code: string, originalAmount: number) {
  try {
    const found = await db.select().from(coupons).where(eq(coupons.code, code.trim().toUpperCase()));
    if (found.length === 0 || !found[0].isActive) {
      return { valid: false, message: 'Invalid or inactive coupon code' };
    }
    const coupon = found[0];
    let discount = 0;
    if (coupon.discountType === 'percent') {
      discount = Math.round((originalAmount * coupon.discountValue) / 100);
    } else {
      discount = coupon.discountValue;
    }
    discount = Math.min(originalAmount, discount);
    return {
      valid: true,
      discount,
      finalAmount: Math.max(0, originalAmount - discount),
      coupon,
    };
  } catch (error) {
    console.error('validateCouponCode error:', error);
    throw new Error('Failed to validate coupon', { cause: error });
  }
}

// TEAM MEMBERS OPERATIONS (Section 2 Requirement)
export async function getTeamMembers(includeHidden = false) {
  try {
    const query = db.select().from(teamMembers);
    if (!includeHidden) {
      return await query.where(eq(teamMembers.isVisible, true)).orderBy(asc(teamMembers.order), asc(teamMembers.id));
    }
    return await query.orderBy(asc(teamMembers.order), asc(teamMembers.id));
  } catch (error) {
    console.error('getTeamMembers error:', error);
    throw new Error('Failed to load team members', { cause: error });
  }
}

export async function createTeamMember(data: {
  name: string;
  role: string;
  image: string;
  bio: string;
  order?: number;
  isVisible?: boolean;
  specialization?: string;
}) {
  try {
    return await db.insert(teamMembers).values(data).returning();
  } catch (error) {
    console.error('createTeamMember error:', error);
    throw new Error('Failed to create team member', { cause: error });
  }
}

export async function updateTeamMember(
  id: number,
  data: Partial<{
    name: string;
    role: string;
    image: string;
    bio: string;
    order: number;
    isVisible: boolean;
    specialization: string;
  }>
) {
  try {
    return await db.update(teamMembers).set(data).where(eq(teamMembers.id, id)).returning();
  } catch (error) {
    console.error('updateTeamMember error:', error);
    throw new Error('Failed to update team member', { cause: error });
  }
}

export async function deleteTeamMember(id: number) {
  try {
    return await db.delete(teamMembers).where(eq(teamMembers.id, id)).returning();
  } catch (error) {
    console.error('deleteTeamMember error:', error);
    throw new Error('Failed to delete team member', { cause: error });
  }
}

// COURSE RESOURCES & TEMPLATES OPERATIONS (Section 8 Requirement)
export async function getCourseResources(courseId: number) {
  try {
    return await db
      .select()
      .from(courseResources)
      .where(eq(courseResources.courseId, courseId))
      .orderBy(desc(courseResources.createdAt));
  } catch (error) {
    console.error('getCourseResources error:', error);
    throw new Error('Failed to load course resources', { cause: error });
  }
}

export async function createCourseResource(data: {
  courseId: number;
  lessonId?: number;
  title: string;
  description?: string;
  fileType: string;
  fileUrl: string;
  fileSize?: string;
  isProtected?: boolean;
}) {
  try {
    return await db.insert(courseResources).values(data).returning();
  } catch (error) {
    console.error('createCourseResource error:', error);
    throw new Error('Failed to create course resource', { cause: error });
  }
}

export async function deleteCourseResource(id: number) {
  try {
    return await db.delete(courseResources).where(eq(courseResources.id, id)).returning();
  } catch (error) {
    console.error('deleteCourseResource error:', error);
    throw new Error('Failed to delete course resource', { cause: error });
  }
}

// CATEGORIES CRUD
export async function createCategory(data: {
  name: string;
  slug?: string;
  icon?: string;
  description?: string;
}) {
  try {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return await db
      .insert(courseCategories)
      .values({
        name: data.name,
        slug,
        icon: data.icon || 'Sparkles',
        description: data.description || '',
      })
      .returning();
  } catch (error) {
    console.error('createCategory error:', error);
    throw new Error('Failed to create course category', { cause: error });
  }
}

export async function updateCategory(
  id: number,
  data: Partial<{
    name: string;
    slug: string;
    icon: string;
    description: string;
  }>
) {
  try {
    return await db.update(courseCategories).set(data).where(eq(courseCategories.id, id)).returning();
  } catch (error) {
    console.error('updateCategory error:', error);
    throw new Error('Failed to update course category', { cause: error });
  }
}

export async function deleteCategory(id: number) {
  try {
    const deleted = await db.delete(courseCategories).where(eq(courseCategories.id, id)).returning();
    await createAuditLog('DELETE_CATEGORY', `Category ID ${id}`, `Deleted category: ${deleted[0]?.name || id}`);
    return deleted;
  } catch (error) {
    console.error('deleteCategory error:', error);
    throw new Error('Failed to delete course category', { cause: error });
  }
}

// MODULE & LESSON DELETIONS
export async function deleteCourseModule(courseId: number, moduleId: number) {
  try {
    // 1. Get all lessons in this module
    const moduleLessons = await db
      .select({ id: lessons.id })
      .from(lessons)
      .where(and(eq(lessons.courseId, courseId), eq(lessons.moduleId, moduleId)));

    // 2. Delete resources linked to those lessons
    for (const les of moduleLessons) {
      await db.delete(courseResources).where(eq(courseResources.lessonId, les.id));
    }

    // 3. Delete lessons
    await db.delete(lessons).where(and(eq(lessons.courseId, courseId), eq(lessons.moduleId, moduleId)));

    // 4. Delete assignments linked to this module
    const moduleAssignments = await db
      .select({ id: assignments.id })
      .from(assignments)
      .where(and(eq(assignments.courseId, courseId), eq(assignments.moduleId, moduleId)));
    for (const a of moduleAssignments) {
      await db.delete(submissions).where(eq(submissions.assignmentId, a.id));
    }
    await db.delete(assignments).where(and(eq(assignments.courseId, courseId), eq(assignments.moduleId, moduleId)));

    // 5. Delete module
    const deleted = await db
      .delete(courseModules)
      .where(and(eq(courseModules.id, moduleId), eq(courseModules.courseId, courseId)))
      .returning();

    // 6. Update course modulesCount
    await db
      .update(courses)
      .set({
        modulesCount: sql<number>`(SELECT count(*) FROM course_modules WHERE course_id = ${courseId})`,
        lecturesCount: sql<number>`(SELECT count(*) FROM lessons WHERE course_id = ${courseId})`,
      })
      .where(eq(courses.id, courseId));

    await createAuditLog('DELETE_MODULE', `Course ID ${courseId}, Module ID ${moduleId}`, `Deleted module: ${deleted[0]?.title || moduleId}`);
    return deleted[0];
  } catch (error) {
    console.error('deleteCourseModule error:', error);
    throw new Error('Failed to delete course module', { cause: error });
  }
}

export async function deleteCourseLesson(courseId: number, lessonId: number) {
  try {
    // 1. Delete resources linked to this lesson
    await db.delete(courseResources).where(eq(courseResources.lessonId, lessonId));

    // 2. Delete the lesson
    const deleted = await db
      .delete(lessons)
      .where(and(eq(lessons.id, lessonId), eq(lessons.courseId, courseId)))
      .returning();

    // 3. Update course lecturesCount
    await db
      .update(courses)
      .set({
        lecturesCount: sql<number>`(SELECT count(*) FROM lessons WHERE course_id = ${courseId})`,
      })
      .where(eq(courses.id, courseId));

    await createAuditLog('DELETE_LESSON', `Course ID ${courseId}, Lesson ID ${lessonId}`, `Deleted lecture: ${deleted[0]?.title || lessonId}`);
    return deleted[0];
  } catch (error) {
    console.error('deleteCourseLesson error:', error);
    throw new Error('Failed to delete lecture', { cause: error });
  }
}

// QUIZ & ASSIGNMENT DELETIONS
export async function deleteQuiz(quizId: number) {
  try {
    await db.delete(quizAttempts).where(eq(quizAttempts.quizId, quizId));
    await db.delete(quizQuestions).where(eq(quizQuestions.quizId, quizId));
    const deleted = await db.delete(quizzes).where(eq(quizzes.id, quizId)).returning();
    await createAuditLog('DELETE_QUIZ', `Quiz ID ${quizId}`, `Deleted quiz: ${deleted[0]?.title || quizId}`);
    return deleted[0];
  } catch (error) {
    console.error('deleteQuiz error:', error);
    throw new Error('Failed to delete quiz', { cause: error });
  }
}

export async function deleteAssignment(assignmentId: number) {
  try {
    await db.delete(submissions).where(eq(submissions.assignmentId, assignmentId));
    const deleted = await db.delete(assignments).where(eq(assignments.id, assignmentId)).returning();
    await createAuditLog('DELETE_ASSIGNMENT', `Assignment ID ${assignmentId}`, `Deleted assignment: ${deleted[0]?.title || assignmentId}`);
    return deleted[0];
  } catch (error) {
    console.error('deleteAssignment error:', error);
    throw new Error('Failed to delete assignment', { cause: error });
  }
}

// USER ACCOUNT DELETION (SAFE & SOFT DELETION)
export async function deleteUser(userId: number, soft: boolean = true) {
  try {
    const userToDel = await db.select().from(users).where(eq(users.id, userId));
    if (userToDel.length === 0) throw new Error('User not found');

    // Never allow deleting the primary owner
    if (userToDel[0].email.toLowerCase() === 'zohaibalioffical12@gmail.com') {
      throw new Error('Founder & Owner account cannot be deleted.');
    }

    // Check if user has payments or certificates
    const userPayments = await db.select({ count: sql<number>`count(*)` }).from(payments).where(eq(payments.userId, userId));
    const userCerts = await db.select({ count: sql<number>`count(*)` }).from(certificates).where(eq(certificates.userId, userId));
    const hasHistory = Number(userPayments[0]?.count || 0) > 0 || Number(userCerts[0]?.count || 0) > 0;

    // If soft delete or has history, mark as suspended / deleted
    if (soft || hasHistory) {
      const updated = await db
        .update(users)
        .set({ status: 'suspended' })
        .where(eq(users.id, userId))
        .returning();
      await createAuditLog('SUSPEND_USER', `User ID ${userId}`, `Suspended user account: ${userToDel[0].email} (historical financial/cert records preserved)`);
      return { success: true, softDeleted: true, user: updated[0] };
    }

    // Otherwise permanent delete clean records
    await db.delete(submissions).where(eq(submissions.studentId, userId));
    await db.delete(quizAttempts).where(eq(quizAttempts.studentId, userId));
    await db.delete(enrollments).where(eq(enrollments.userId, userId));
    await db.delete(reviews).where(eq(reviews.studentId, userId));
    const deleted = await db.delete(users).where(eq(users.id, userId)).returning();
    await createAuditLog('PERMANENT_DELETE_USER', `User ID ${userId}`, `Permanently deleted user: ${userToDel[0].email}`);
    return { success: true, softDeleted: false, user: deleted[0] };
  } catch (error: any) {
    console.error('deleteUser error:', error);
    throw new Error(error.message || 'Failed to delete user account', { cause: error });
  }
}

// REVIEWS & TESTIMONIALS MANAGEMENT
export async function getAllReviewsAdmin() {
  try {
    const list = await db
      .select({
        review: reviews,
        student: {
          fullName: users.fullName,
          profileImage: users.profileImage,
          email: users.email,
        },
        course: {
          title: courses.title,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.studentId, users.id))
      .leftJoin(courses, eq(reviews.courseId, courses.id))
      .orderBy(desc(reviews.createdAt));

    return list.map((r) => ({
      ...r.review,
      studentName: r.student?.fullName || 'Student',
      studentPhoto: r.student?.profileImage,
      studentEmail: r.student?.email,
      courseTitle: r.course?.title || 'General',
    }));
  } catch (error) {
    console.error('getAllReviewsAdmin error:', error);
    throw new Error('Failed to load admin reviews', { cause: error });
  }
}

export async function updateReviewStatus(reviewId: number, isApproved: boolean) {
  try {
    const updated = await db
      .update(reviews)
      .set({ isApproved })
      .where(eq(reviews.id, reviewId))
      .returning();
    await createAuditLog('UPDATE_REVIEW_STATUS', `Review ID ${reviewId}`, `Approved status: ${isApproved}`);
    return updated[0];
  } catch (error) {
    console.error('updateReviewStatus error:', error);
    throw new Error('Failed to update review status', { cause: error });
  }
}

export async function deleteReview(reviewId: number) {
  try {
    const deleted = await db.delete(reviews).where(eq(reviews.id, reviewId)).returning();
    await createAuditLog('DELETE_REVIEW', `Review ID ${reviewId}`, 'Deleted testimonial/review');
    return deleted[0];
  } catch (error) {
    console.error('deleteReview error:', error);
    throw new Error('Failed to delete review', { cause: error });
  }
}

// ANNOUNCEMENTS
export async function getAnnouncements(targetRole: string = 'all') {
  try {
    if (targetRole === 'admin') {
      return await db.select().from(announcements).orderBy(desc(announcements.createdAt));
    }
    return await db
      .select()
      .from(announcements)
      .where(and(eq(announcements.targetRole, targetRole)))
      .orderBy(desc(announcements.createdAt));
  } catch (error) {
    console.error('getAnnouncements error:', error);
    throw new Error('Failed to load announcements', { cause: error });
  }
}

export async function createAnnouncement(data: {
  title: string;
  content: string;
  targetRole?: string;
  courseId?: number;
  createdBy?: number;
}) {
  try {
    const created = await db
      .insert(announcements)
      .values({
        title: data.title,
        content: data.content,
        targetRole: data.targetRole || 'all',
        courseId: data.courseId || null,
        createdBy: data.createdBy || null,
      })
      .returning();
    await createAuditLog('CREATE_ANNOUNCEMENT', `Announcement ID ${created[0].id}`, `Created announcement: ${data.title}`);
    return created[0];
  } catch (error) {
    console.error('createAnnouncement error:', error);
    throw new Error('Failed to create announcement', { cause: error });
  }
}

export async function deleteAnnouncement(id: number) {
  try {
    const deleted = await db.delete(announcements).where(eq(announcements.id, id)).returning();
    await createAuditLog('DELETE_ANNOUNCEMENT', `Announcement ID ${id}`, `Deleted announcement: ${deleted[0]?.title || id}`);
    return deleted[0];
  } catch (error) {
    console.error('deleteAnnouncement error:', error);
    throw new Error('Failed to delete announcement', { cause: error });
  }
}

// SUPPORT TICKETS / CONTACT MESSAGES
export async function getSupportTickets() {
  try {
    return await db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
  } catch (error) {
    console.error('getSupportTickets error:', error);
    throw new Error('Failed to load support tickets', { cause: error });
  }
}

export async function createSupportTicket(data: {
  studentName: string;
  email: string;
  subject: string;
  message: string;
  userId?: number;
  priority?: string;
}) {
  try {
    return await db
      .insert(supportTickets)
      .values({
        studentName: data.studentName,
        email: data.email,
        subject: data.subject,
        message: data.message,
        userId: data.userId || null,
        priority: data.priority || 'normal',
        status: 'open',
      })
      .returning();
  } catch (error) {
    console.error('createSupportTicket error:', error);
    throw new Error('Failed to create support ticket', { cause: error });
  }
}

export async function updateSupportTicketStatus(id: number, status: string, response?: string) {
  try {
    const payload: any = { status };
    if (response) payload.response = response;
    const updated = await db.update(supportTickets).set(payload).where(eq(supportTickets.id, id)).returning();
    await createAuditLog('UPDATE_SUPPORT_TICKET', `Ticket ID ${id}`, `Status changed to: ${status}`);
    return updated[0];
  } catch (error) {
    console.error('updateSupportTicketStatus error:', error);
    throw new Error('Failed to update ticket status', { cause: error });
  }
}

export async function deleteSupportTicket(id: number) {
  try {
    const deleted = await db.delete(supportTickets).where(eq(supportTickets.id, id)).returning();
    await createAuditLog('DELETE_SUPPORT_TICKET', `Ticket ID ${id}`, 'Deleted support/contact ticket');
    return deleted[0];
  } catch (error) {
    console.error('deleteSupportTicket error:', error);
    throw new Error('Failed to delete support ticket', { cause: error });
  }
}

// AUDIT LOGGING
export async function createAuditLog(action: string, target: string, details?: string, adminId?: number, ipAddress?: string) {
  try {
    return await db
      .insert(adminAuditLogs)
      .values({
        action,
        target,
        details: details || null,
        adminId: adminId || null,
        ipAddress: ipAddress || '127.0.0.1',
      })
      .returning();
  } catch (error) {
    // Non-blocking log error
    console.error('createAuditLog error:', error);
    return null;
  }
}

export async function getAuditLogs(limitCount = 50) {
  try {
    return await db
      .select({
        log: adminAuditLogs,
        admin: {
          fullName: users.fullName,
          email: users.email,
        },
      })
      .from(adminAuditLogs)
      .leftJoin(users, eq(adminAuditLogs.adminId, users.id))
      .orderBy(desc(adminAuditLogs.createdAt))
      .limit(limitCount);
  } catch (error) {
    console.error('getAuditLogs error:', error);
    throw new Error('Failed to load audit logs', { cause: error });
  }
}


