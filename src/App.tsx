import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Course, CourseCategory, InstituteStats, SiteSettings, Certificate } from './types/index.ts';
import { Navbar } from './components/common/Navbar.tsx';
import { Footer } from './components/common/Footer.tsx';
import { HeroSection } from './components/home/HeroSection.tsx';
import { HomeCourseSections } from './components/home/HomeCourseSections.tsx';
import { WhyChooseUs } from './components/home/WhyChooseUs.tsx';
import { TeachersSection } from './components/home/TeachersSection.tsx';
import { StudentProjectsSection } from './components/home/StudentProjectsSection.tsx';
import { TestimonialsSection } from './components/home/TestimonialsSection.tsx';
import { FAQSection } from './components/home/FAQSection.tsx';
import { ContactSection } from './components/home/ContactSection.tsx';
import { AboutSection } from './components/home/AboutSection.tsx';
import { FounderSection } from './components/home/FounderSection.tsx';
import { TeamSection } from './components/home/TeamSection.tsx';
import { OurTeamPage } from './components/pages/OurTeamPage.tsx';
import { InstituteIntroSection } from './components/home/InstituteIntroSection.tsx';
import { ExploreCategoriesSection } from './components/home/ExploreCategoriesSection.tsx';
import { LearningProcessSection } from './components/home/LearningProcessSection.tsx';
import { CTASection } from './components/home/CTASection.tsx';
import { FounderPage } from './components/pages/FounderPage.tsx';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage.tsx';
import { TermsPage } from './components/pages/TermsPage.tsx';
import { CourseCatalog } from './components/courses/CourseCatalog.tsx';
import { CourseDetailsModal } from './components/courses/CourseDetailsModal.tsx';
import { PaymentModal } from './components/modals/PaymentModal.tsx';
import { CertificateModal } from './components/modals/CertificateModal.tsx';
import { VerifyCertificateModal } from './components/modals/VerifyCertificateModal.tsx';
import { LecturePlayer } from './components/player/LecturePlayer.tsx';
import { SuperAdminControlCenter } from './components/admin/SuperAdminControlCenter.tsx';
import { TeacherPortal } from './components/teacher/TeacherPortal.tsx';
import { StudentDashboard } from './components/student/StudentDashboard.tsx';

function MainApp() {
  const { currentUser, signInWithGoogle } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [stats, setStats] = useState<InstituteStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([]);
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<number | 'all'>('all');

  // Modal States
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<Course | null>(null);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  // Player State
  const [activePlayerCourseId, setActivePlayerCourseId] = useState<number | null>(null);

  // Load Initial Institute Data
  const loadPlatformData = async () => {
    try {
      const [statsRes, coursesRes, catsRes, settingsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/courses'),
        fetch('/api/categories'),
        fetch('/api/settings'),
      ]);

      const sData = await statsRes.json();
      const cData = await coursesRes.json();
      const catData = await catsRes.json();
      const settsData = await settingsRes.json();

      setStats(sData);
      if (Array.isArray(cData)) setCourses(cData);
      if (Array.isArray(catData)) setCategories(catData);
      if (settsData && !settsData.error) setSiteSettings(settsData);
    } catch (err) {
      console.error('Error loading platform data:', err);
    }
  };

  // Load User Enrollments
  const loadUserEnrollments = async () => {
    if (currentUser?.id) {
      try {
        const res = await fetch(`/api/user/${currentUser.id}/enrollments`);
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list)) {
            setEnrolledCourseIds(list.map((item: any) => item.courseId));
          }
        }
      } catch (err) {
        console.error('Error loading enrollments:', err);
      }
    } else {
      setEnrolledCourseIds([]);
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, []);

  useEffect(() => {
    loadUserEnrollments();
  }, [currentUser]);

  // Handle Free Enrollment
  const handleEnrollFree = async (courseId: number) => {
    if (!currentUser) {
      signInWithGoogle();
      return;
    }

    try {
      const res = await fetch('/api/enroll/free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, courseId }),
      });

      if (res.ok) {
        setCourseModalOpen(false);
        await loadUserEnrollments();
        // Immediately launch lecture player!
        setActivePlayerCourseId(courseId);
        setCurrentTab('player');
      }
    } catch (err) {
      alert('Enrollment error');
    }
  };

  const handleOpenCourseModal = (course: Course) => {
    setSelectedCourseForModal(course);
    setCourseModalOpen(true);
  };

  const handleOpenPayment = (course: Course) => {
    setCourseModalOpen(false);
    setCheckoutCourse(course);
    setPaymentModalOpen(true);
  };

  const handleOpenPlayerFromCourse = (course: Course) => {
    setCourseModalOpen(false);
    setActivePlayerCourseId(course.id);
    setCurrentTab('player');
  };

  const handleOpenCertificate = async (courseId: number) => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch(`/api/user/${currentUser.id}/certificates`);
      if (res.ok) {
        const certs: Certificate[] = await res.json();
        const found = certs.find((c) => c.courseId === courseId);
        if (found) {
          setActiveCertificate(found);
          setCertModalOpen(true);
        } else {
          alert('Certificate is issuing or evaluation requirements are in progress.');
        }
      }
    } catch {
      alert('Failed to load certificate');
    }
  };

  // If Lecture Player is active
  if (currentTab === 'player' && activePlayerCourseId) {
    return (
      <LecturePlayer
        courseId={activePlayerCourseId}
        onBack={() => setCurrentTab('courses')}
        onOpenCertificate={handleOpenCertificate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onNavigate={(tab) => {
          if (tab === 'verify-certificate') {
            setVerifyModalOpen(true);
          } else {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        siteLogoUrl={siteSettings?.logo_url}
      />

      {/* Main Content Pages */}
      <main className="flex-1">
        {/* 1. HOMEPAGE */}
        {currentTab === 'home' && (
          <div>
            {/* 2. Hero Section */}
            <HeroSection
              stats={stats}
              onExploreCourses={() => {
                setCatalogCategoryFilter('all');
                setCurrentTab('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onStartLearning={() => {
                if (currentUser) {
                  setCurrentTab('student');
                } else {
                  signInWithGoogle();
                }
              }}
            />

            {/* 3. Short introduction to ZA GLOBAL TECH INSTITUTE */}
            <InstituteIntroSection
              onExploreCourses={() => {
                setCatalogCategoryFilter('all');
                setCurrentTab('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewAbout={() => {
                setCurrentTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 4. Explore Our Courses (Domain Discovery) */}
            <ExploreCategoriesSection
              categories={categories}
              onSelectCategory={(categoryId) => {
                setCatalogCategoryFilter(categoryId);
                setCurrentTab('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreAll={() => {
                setCatalogCategoryFilter('all');
                setCurrentTab('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 5. Popular Courses, 6. Free Opportunities, 7. Premium Courses */}
            <HomeCourseSections
              courses={courses}
              onSelectCourse={handleOpenCourseModal}
              onExploreAll={() => {
                setCatalogCategoryFilter('all');
                setCurrentTab('courses');
              }}
              onExploreFree={() => setCurrentTab('free-courses')}
              onExplorePaid={() => setCurrentTab('paid-courses')}
              enrolledCourseIds={enrolledCourseIds}
            />

            {/* 8. Why Choose Us? */}
            <WhyChooseUs />

            {/* 9. Learning Process — Step by Step */}
            <LearningProcessSection
              onStartLearning={() => {
                if (currentUser) {
                  setCurrentTab('student');
                } else {
                  signInWithGoogle();
                }
              }}
            />

            {/* 10. Meet Our Founder */}
            <FounderSection
              settings={siteSettings}
              onViewFounderPage={() => {
                setCurrentTab('founder');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreFounderCourses={() => {
                setCatalogCategoryFilter('all');
                setCurrentTab('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 11. Our Professional Team */}
            <TeamSection
              onViewTeamPage={() => {
                setCurrentTab('team');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreCourses={() => {
                setCatalogCategoryFilter('all');
                setCurrentTab('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 12. Student Projects and Achievements */}
            <StudentProjectsSection />

            {/* 13. Student Testimonials */}
            <TestimonialsSection />

            {/* 14. Frequently Asked Questions */}
            <FAQSection />

            {/* 15. Call-to-action Section */}
            <CTASection
              onExploreCourses={() => {
                setCatalogCategoryFilter('all');
                setCurrentTab('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onStartLearning={() => {
                if (currentUser) {
                  setCurrentTab('student');
                } else {
                  signInWithGoogle();
                }
              }}
            />
          </div>
        )}

        {/* 2. ALL COURSES CATALOG */}
        {currentTab === 'courses' && (
          <CourseCatalog
            courses={courses}
            categories={categories}
            onSelectCourse={handleOpenCourseModal}
            enrolledCourseIds={enrolledCourseIds}
            initialFilter="all"
            initialCategory={catalogCategoryFilter}
          />
        )}

        {/* 3. FREE COURSES (PKR 0) */}
        {currentTab === 'free-courses' && (
          <CourseCatalog
            courses={courses}
            categories={categories}
            onSelectCourse={handleOpenCourseModal}
            enrolledCourseIds={enrolledCourseIds}
            initialFilter="free"
          />
        )}

        {/* 4. PAID COURSES */}
        {currentTab === 'paid-courses' && (
          <CourseCatalog
            courses={courses}
            categories={categories}
            onSelectCourse={handleOpenCourseModal}
            enrolledCourseIds={enrolledCourseIds}
            initialFilter="paid"
          />
        )}

        {/* 5. FOUNDER PROFILE PAGE */}
        {currentTab === 'founder' && (
          <FounderPage
            settings={siteSettings}
            courses={courses}
            onSelectCourse={handleOpenCourseModal}
            enrolledCourseIds={enrolledCourseIds}
            onExploreAllCourses={() => setCurrentTab('courses')}
          />
        )}

        {/* 6. ABOUT US */}
        {currentTab === 'about' && (
          <AboutSection
            settings={siteSettings}
            onExploreCourses={() => setCurrentTab('courses')}
          />
        )}

        {/* 7. FAQ PAGE */}
        {currentTab === 'faq' && (
          <div className="py-12">
            <FAQSection />
          </div>
        )}

        {/* 8. PRIVACY POLICY */}
        {currentTab === 'privacy' && (
          <PrivacyPolicyPage settings={siteSettings} />
        )}

        {/* 9. TERMS & CONDITIONS */}
        {currentTab === 'terms' && (
          <TermsPage settings={siteSettings} />
        )}

        {/* 6. OUR TEAM PAGE */}
        {(currentTab === 'team' || currentTab === 'teachers') && (
          <OurTeamPage
            onExploreCourses={() => {
              setCatalogCategoryFilter('all');
              setCurrentTab('courses');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 7. STUDENT PROJECTS */}
        {currentTab === 'projects' && (
          <div className="py-12">
            <StudentProjectsSection />
          </div>
        )}

        {/* 8. CONTACT */}
        {currentTab === 'contact' && (
          <div className="py-12">
            <ContactSection settings={siteSettings} />
          </div>
        )}

        {/* 9. SUPER ADMIN OWNER CONTROL CENTER */}
        {currentTab === 'admin' && (
          <SuperAdminControlCenter
            onCourseUpdated={loadPlatformData}
            siteSettings={siteSettings}
            onRefreshSettings={loadPlatformData}
          />
        )}

        {/* 10. TEACHER PORTAL */}
        {currentTab === 'teacher' && <TeacherPortal />}

        {/* 11. STUDENT DASHBOARD */}
        {currentTab === 'student' && (
          <StudentDashboard
            onOpenPlayer={handleOpenPlayerFromCourse}
            onOpenCertificateModal={(cert) => {
              setActiveCertificate(cert);
              setCertModalOpen(true);
            }}
            onBrowseCourses={() => setCurrentTab('courses')}
          />
        )}
      </main>

      {/* Global Modals */}
      {selectedCourseForModal && (
        <CourseDetailsModal
          course={selectedCourseForModal}
          isOpen={courseModalOpen}
          onClose={() => setCourseModalOpen(false)}
          onEnrollFree={handleEnrollFree}
          onProceedToPayment={handleOpenPayment}
          onOpenPlayer={handleOpenPlayerFromCourse}
          isEnrolled={enrolledCourseIds.includes(selectedCourseForModal.id)}
        />
      )}

      {checkoutCourse && (
        <PaymentModal
          course={checkoutCourse}
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          onPaymentSuccess={() => {
            loadUserEnrollments();
            setCurrentTab('student');
          }}
          settings={siteSettings}
        />
      )}

      {activeCertificate && (
        <CertificateModal
          certificate={activeCertificate}
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
        />
      )}

      <VerifyCertificateModal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
      />

      {/* Global Footer */}
      <Footer
        settings={siteSettings}
        onNavigate={(tab) => {
          if (tab === 'verify-certificate') {
            setVerifyModalOpen(true);
          } else {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
