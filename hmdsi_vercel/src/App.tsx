import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import StructurePage from './pages/StructurePage';
import ProkerPage from './pages/ProkerPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import GalleryPage from './pages/GalleryPage';
import AspirationPage from './pages/AspirationPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminMembersPage from './pages/admin/AdminMembersPage';
import AdminProgramsPage from './pages/admin/AdminProgramsPage';
import AdminNewsPage from './pages/admin/AdminNewsPage';
import AdminGalleryPage from './pages/admin/AdminGalleryPage';
import AdminResourcesPage from './pages/admin/AdminResourcesPage';
import AdminDocumentsPage from './pages/admin/AdminDocumentsPage';
import AdminAspirationsPage from './pages/admin/AdminAspirationsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#050014] selection:bg-[#0200B5] selection:text-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            {/* Public website */}
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="structure" element={<StructurePage />} />
              <Route path="proker" element={<ProkerPage />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="news/:slug" element={<NewsDetailPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="aspiration" element={<AspirationPage />} />
            </Route>

            {/* Admin login must stay outside the public layout */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="members" element={<AdminMembersPage />} />
              <Route path="programs" element={<AdminProgramsPage />} />
              <Route path="news" element={<AdminNewsPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="resources" element={<AdminResourcesPage />} />
              <Route path="documents" element={<AdminDocumentsPage />} />
              <Route path="aspirations" element={<AdminAspirationsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Unknown public paths */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#050014] text-white flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">404</p>
        <h1 className="mt-3 text-4xl font-black">Halaman tidak ditemukan</h1>
        <a
          href="/"
          className="inline-flex mt-8 btn-editorial btn-editorial-primary"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
