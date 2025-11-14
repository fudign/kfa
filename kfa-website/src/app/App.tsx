import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ProtectedRoute } from '@/components/routing/ProtectedRoute';
import { useScrollToHash } from '@/hooks/useScrollToHash';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt';
import { PWAUpdateNotification } from '@/components/pwa/PWAUpdateNotification';

// Lazy loading для критически важных страниц - загружаются сразу
import { HomePage } from '@/pages/public/Home';

// Lazy loading публичных страниц
const AboutPage = lazy(() => import('@/pages/public/About').then(m => ({ default: m.AboutPage })));
const DocumentsPage = lazy(() => import('@/pages/public/Documents').then(m => ({ default: m.DocumentsPage })));
const DocumentViewer = lazy(() => import('@/pages/public/DocumentViewer').then(m => ({ default: m.DocumentViewer })));
const MembershipPage = lazy(() => import('@/pages/public/Membership').then(m => ({ default: m.MembershipPage })));
const JoinPage = lazy(() => import('@/pages/public/membership/Join').then(m => ({ default: m.JoinPage })));
const MembersPage = lazy(() => import('@/pages/public/Members').then(m => ({ default: m.MembersPage })));
const FAQPage = lazy(() => import('@/pages/public/FAQ').then(m => ({ default: m.FAQPage })));
const NewsPage = lazy(() => import('@/pages/public/News').then(m => ({ default: m.NewsPage })));
const EventsPage = lazy(() => import('@/pages/public/Events').then(m => ({ default: m.EventsPage })));
const StandardsPage = lazy(() => import('@/pages/public/Standards').then(m => ({ default: m.StandardsPage })));
const EducationPage = lazy(() => import('@/pages/public/Education').then(m => ({ default: m.EducationPage })));
const ProgramsPage = lazy(() => import('@/pages/public/education/Programs').then(m => ({ default: m.ProgramsPage })));
const CertificationPage = lazy(() => import('@/pages/public/education/Certification').then(m => ({ default: m.CertificationPage })));
const CalendarPage = lazy(() => import('@/pages/public/education/Calendar').then(m => ({ default: m.CalendarPage })));
const ResearchPage = lazy(() => import('@/pages/public/Research').then(m => ({ default: m.ResearchPage })));
const ResearchArticlePage = lazy(() => import('@/pages/public/ResearchArticle').then(m => ({ default: m.ResearchArticlePage })));

// Lazy loading для governance страниц
const GovernanceCodePage = lazy(() => import('@/pages/public/governance/Code').then(m => ({ default: m.GovernanceCodePage })));
const DirectorsCertificationPage = lazy(() => import('@/pages/public/governance/DirectorsCertification').then(m => ({ default: m.DirectorsCertificationPage })));
const DirectorsDatabasePage = lazy(() => import('@/pages/public/governance/DirectorsDatabase').then(m => ({ default: m.DirectorsDatabasePage })));
const GovernanceScorecardPage = lazy(() => import('@/pages/public/governance/Scorecard').then(m => ({ default: m.GovernanceScorecardPage })));
const DirectorsCommunityPage = lazy(() => import('@/pages/public/governance/DirectorsCommunity').then(m => ({ default: m.DirectorsCommunityPage })));

// Lazy loading для auth страниц
const LoginPage = lazy(() => import('@/pages/auth/Login').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/auth/Register').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPassword').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPassword').then(m => ({ default: m.ResetPasswordPage })));
const ForceLogoutPage = lazy(() => import('@/pages/auth/ForceLogout').then(m => ({ default: m.ForceLogoutPage })));

// Lazy loading для dashboard страниц
const DashboardPage = lazy(() => import('@/pages/dashboard/Dashboard').then(m => ({ default: m.DashboardPage })));
const ProfilePage = lazy(() => import('@/pages/dashboard/Profile').then(m => ({ default: m.ProfilePage })));
const PaymentsPage = lazy(() => import('@/pages/dashboard/Payments').then(m => ({ default: m.PaymentsPage })));
const DashboardDocumentsPage = lazy(() => import('@/pages/dashboard/Documents').then(m => ({ default: m.DocumentsPage })));
const CertificatesPage = lazy(() => import('@/pages/dashboard/Certificates').then(m => ({ default: m.CertificatesPage })));
const DashboardEducationPage = lazy(() => import('@/pages/dashboard/Education').then(m => ({ default: m.EducationPage })));
const MyRegistrationsPage = lazy(() => import('@/pages/dashboard/MyRegistrations').then(m => ({ default: m.MyRegistrations })));
const MediaManagerPage = lazy(() => import('@/pages/dashboard/MediaManager').then(m => ({ default: m.MediaManagerPage })));
const PartnersManagerPage = lazy(() => import('@/pages/dashboard/PartnersManager').then(m => ({ default: m.PartnersManagerPage })));
const SettingsManagerPage = lazy(() => import('@/pages/dashboard/SettingsManager').then(m => ({ default: m.SettingsManagerPage })));
const NewsManagerPage = lazy(() => import('@/pages/dashboard/NewsManager').then(m => ({ default: m.NewsManagerPage })));
const EventsManagerPage = lazy(() => import('@/pages/dashboard/EventsManager').then(m => ({ default: m.EventsManagerPage })));
const MembersManagerPage = lazy(() => import('@/pages/dashboard/MembersManager').then(m => ({ default: m.MembersManagerPage })));
const ApplicationsManagerPage = lazy(() => import('@/pages/dashboard/ApplicationsManager').then(m => ({ default: m.ApplicationsManagerPage })));

// Lazy loading для legal и error страниц
const PrivacyPage = lazy(() => import('@/pages/legal/Privacy').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('@/pages/legal/Terms').then(m => ({ default: m.TermsPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFound').then(m => ({ default: m.NotFoundPage })));
const Forbidden403Page = lazy(() => import('@/pages/errors/Forbidden403').then(m => ({ default: m.Forbidden403Page })));

function App() {
  // Enable hash navigation (scroll to element with id matching hash)
  useScrollToHash();
  return (
    <>
      {/* PWA Components - показываются на всех страницах */}
      <OfflineBanner />
      <PWAInstallPrompt />
      <PWAUpdateNotification />

      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center">
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
          </div>
        }
      >
        <Routes>
        {/* Protected Dashboard Routes - without Header & Footer */}
        {/* Главная страница dashboard - доступна всем авторизованным */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAuth={true}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Профиль - доступен всем авторизованным */}
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute requireAuth={true}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Платежи - только для admin и member */}
        <Route
          path="/dashboard/payments"
          element={
            <ProtectedRoute requireRole={['admin', 'member']}>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />

        {/* Документы - только для admin и member */}
        <Route
          path="/dashboard/documents"
          element={
            <ProtectedRoute requireRole={['admin', 'member']}>
              <DashboardDocumentsPage />
            </ProtectedRoute>
          }
        />

        {/* Сертификаты - только для admin и member */}
        <Route
          path="/dashboard/certificates"
          element={
            <ProtectedRoute requireRole={['admin', 'member']}>
              <CertificatesPage />
            </ProtectedRoute>
          }
        />

        {/* Обучение - только для admin и member */}
        <Route
          path="/dashboard/education"
          element={
            <ProtectedRoute requireRole={['admin', 'member']}>
              <DashboardEducationPage />
            </ProtectedRoute>
          }
        />

        {/* Мои регистрации на события - доступно всем авторизованным */}
        <Route
          path="/dashboard/my-registrations"
          element={
            <ProtectedRoute requireAuth={true}>
              <MyRegistrationsPage />
            </ProtectedRoute>
          }
        />

        {/* Управление новостями - требуется право content.view */}
        <Route
          path="/dashboard/news"
          element={
            <ProtectedRoute requirePermission="content.view">
              <NewsManagerPage />
            </ProtectedRoute>
          }
        />

        {/* Управление событиями - требуется право events.view */}
        <Route
          path="/dashboard/events"
          element={
            <ProtectedRoute requirePermission="events.view">
              <EventsManagerPage />
            </ProtectedRoute>
          }
        />

        {/* Управление участниками - требуется право members.view */}
        <Route
          path="/dashboard/members"
          element={
            <ProtectedRoute requirePermission="members.view">
              <MembersManagerPage />
            </ProtectedRoute>
          }
        />

        {/* Управление медиафайлами - требуется право media.view */}
        <Route
          path="/dashboard/media"
          element={
            <ProtectedRoute requirePermission="media.view">
              <MediaManagerPage />
            </ProtectedRoute>
          }
        />

        {/* Управление партнерами - требуется право partners.view */}
        <Route
          path="/dashboard/partners"
          element={
            <ProtectedRoute requirePermission="partners.view">
              <PartnersManagerPage />
            </ProtectedRoute>
          }
        />

        {/* Управление заявками на членство - требуется право applications.view */}
        <Route
          path="/dashboard/applications"
          element={
            <ProtectedRoute requirePermission="applications.view">
              <ApplicationsManagerPage />
            </ProtectedRoute>
          }
        />

        {/* Настройки - требуется право settings.view */}
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute requirePermission="settings.view">
              <SettingsManagerPage />
            </ProtectedRoute>
          }
        />

        {/* Public Routes - with Header & Footer */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <AboutPage />
            </PublicLayout>
          }
        />
        <Route
          path="/documents"
          element={
            <PublicLayout>
              <DocumentsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/documents/view/:documentId"
          element={
            <PublicLayout>
              <DocumentViewer />
            </PublicLayout>
          }
        />
        <Route
          path="/membership"
          element={
            <PublicLayout>
              <MembershipPage />
            </PublicLayout>
          }
        />
        <Route
          path="/membership/join"
          element={
            <PublicLayout>
              <JoinPage />
            </PublicLayout>
          }
        />
        <Route
          path="/members"
          element={
            <PublicLayout>
              <MembersPage />
            </PublicLayout>
          }
        />
        <Route
          path="/faq"
          element={
            <PublicLayout>
              <FAQPage />
            </PublicLayout>
          }
        />
        <Route
          path="/news"
          element={
            <PublicLayout>
              <NewsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/events"
          element={
            <PublicLayout>
              <EventsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/standards"
          element={
            <PublicLayout>
              <StandardsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/education"
          element={
            <PublicLayout>
              <EducationPage />
            </PublicLayout>
          }
        />
        <Route
          path="/education/programs"
          element={
            <PublicLayout>
              <ProgramsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/education/certification"
          element={
            <PublicLayout>
              <CertificationPage />
            </PublicLayout>
          }
        />
        <Route
          path="/education/calendar"
          element={
            <PublicLayout>
              <CalendarPage />
            </PublicLayout>
          }
        />
        <Route
          path="/research"
          element={
            <PublicLayout>
              <ResearchPage />
            </PublicLayout>
          }
        />
        <Route
          path="/research/:slug"
          element={
            <PublicLayout>
              <ResearchArticlePage />
            </PublicLayout>
          }
        />
        {/* Governance Routes */}
        <Route
          path="/governance/code"
          element={
            <PublicLayout>
              <GovernanceCodePage />
            </PublicLayout>
          }
        />
        <Route
          path="/governance/directors"
          element={
            <PublicLayout>
              <DirectorsCertificationPage />
            </PublicLayout>
          }
        />
        <Route
          path="/governance/directors-database"
          element={
            <PublicLayout>
              <DirectorsDatabasePage />
            </PublicLayout>
          }
        />
        <Route
          path="/governance/scorecard"
          element={
            <PublicLayout>
              <GovernanceScorecardPage />
            </PublicLayout>
          }
        />
        <Route
          path="/governance/community"
          element={
            <PublicLayout>
              <DirectorsCommunityPage />
            </PublicLayout>
          }
        />
        {/* Auth Routes */}
        <Route
          path="/auth/login"
          element={
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          }
        />
        <Route
          path="/auth/register"
          element={
            <PublicLayout>
              <RegisterPage />
            </PublicLayout>
          }
        />
        <Route
          path="/auth/forgot-password"
          element={
            <PublicLayout>
              <ForgotPasswordPage />
            </PublicLayout>
          }
        />
        <Route
          path="/auth/reset-password"
          element={
            <PublicLayout>
              <ResetPasswordPage />
            </PublicLayout>
          }
        />
        <Route
          path="/auth/force-logout"
          element={<ForceLogoutPage />}
        />

        {/* Legal Pages */}
        <Route
          path="/privacy"
          element={
            <PublicLayout>
              <PrivacyPage />
            </PublicLayout>
          }
        />
        <Route
          path="/terms"
          element={
            <PublicLayout>
              <TermsPage />
            </PublicLayout>
          }
        />

        {/* Error Pages */}
        <Route path="/errors/403" element={<Forbidden403Page />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <NotFoundPage />
            </PublicLayout>
          }
        />
      </Routes>
      </Suspense>
    </>
  );
}

export default App;
