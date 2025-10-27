import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/public/Home';
import { AboutPage } from '@/pages/public/About';
import { DocumentsPage } from '@/pages/public/Documents';
import { MembershipPage } from '@/pages/public/Membership';
import { JoinPage } from '@/pages/public/membership/Join';
import { MembersPage } from '@/pages/public/Members';
import { FAQPage } from '@/pages/public/FAQ';
import { NewsPage } from '@/pages/public/News';
import { EventsPage } from '@/pages/public/Events';
import { StandardsPage } from '@/pages/public/Standards';
import { EducationPage } from '@/pages/public/Education';
import { ProgramsPage } from '@/pages/public/education/Programs';
import { CertificationPage } from '@/pages/public/education/Certification';
import { CalendarPage } from '@/pages/public/education/Calendar';
import { ResearchPage } from '@/pages/public/Research';
import { ResearchArticlePage } from '@/pages/public/ResearchArticle';
import { GovernanceCodePage } from '@/pages/public/governance/Code';
import { DirectorsCertificationPage } from '@/pages/public/governance/DirectorsCertification';
import { DirectorsDatabasePage } from '@/pages/public/governance/DirectorsDatabase';
import { GovernanceScorecardPage } from '@/pages/public/governance/Scorecard';
import { DirectorsCommunityPage } from '@/pages/public/governance/DirectorsCommunity';
import { LoginPage } from '@/pages/auth/Login';
import { RegisterPage } from '@/pages/auth/Register';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPassword';
import { ResetPasswordPage } from '@/pages/auth/ResetPassword';
import { DashboardPage } from '@/pages/dashboard/Dashboard';
import { ProfilePage } from '@/pages/dashboard/Profile';
import { AdminDashboardPage } from '@/pages/dashboard/AdminDashboard';
import { PaymentsPage } from '@/pages/dashboard/Payments';
import { DocumentsPage as DashboardDocumentsPage } from '@/pages/dashboard/Documents';
import { CertificatesPage } from '@/pages/dashboard/Certificates';
import { EducationPage as DashboardEducationPage } from '@/pages/dashboard/Education';
import { MediaManagerPage } from '@/pages/dashboard/MediaManager';
import { PartnersManagerPage } from '@/pages/dashboard/PartnersManager';
import { SettingsManagerPage } from '@/pages/dashboard/SettingsManager';
import { NewsManagerPage } from '@/pages/dashboard/NewsManager';
import { EventsManagerPage } from '@/pages/dashboard/EventsManager';
import { MembersManagerPage } from '@/pages/dashboard/MembersManager';
import { PrivacyPage } from '@/pages/legal/Privacy';
import { TermsPage } from '@/pages/legal/Terms';
import { NotFoundPage } from '@/pages/NotFound';
import { Forbidden403Page } from '@/pages/errors/Forbidden403';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ProtectedRoute } from '@/components/routing/ProtectedRoute';
import { useScrollToHash } from '@/hooks/useScrollToHash';
import { OfflineBanner } from '@/components/common/OfflineBanner';
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt';
import { PWAUpdateNotification } from '@/components/pwa/PWAUpdateNotification';

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
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin', 'member']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/payments"
          element={
            <ProtectedRoute allowedRoles={['admin', 'member']}>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/documents"
          element={
            <ProtectedRoute allowedRoles={['admin', 'member']}>
              <DashboardDocumentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/certificates"
          element={
            <ProtectedRoute allowedRoles={['admin', 'member']}>
              <CertificatesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/education"
          element={
            <ProtectedRoute allowedRoles={['admin', 'member']}>
              <DashboardEducationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/media"
          element={
            <ProtectedRoute requirePermission={['media.view', 'media.upload', 'media.delete']}>
              <MediaManagerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/partners"
          element={
            <ProtectedRoute requirePermission={['partners.view', 'partners.create', 'partners.update', 'partners.delete']}>
              <PartnersManagerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute requirePermission={['settings.view', 'settings.update']}>
              <SettingsManagerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/news"
          element={
            <ProtectedRoute requirePermission={['content.view', 'content.create', 'content.update', 'content.delete']}>
              <NewsManagerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/events"
          element={
            <ProtectedRoute requirePermission={['events.view', 'events.create', 'events.update', 'events.delete']}>
              <EventsManagerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/members"
          element={
            <ProtectedRoute requirePermission={['members.view', 'members.create', 'members.update', 'members.delete']}>
              <MembersManagerPage />
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
