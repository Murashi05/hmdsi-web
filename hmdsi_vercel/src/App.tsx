import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import StructurePage from './pages/StructurePage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminMembersPage from './pages/admin/AdminMembersPage';
import AdminProgramsPage from './pages/admin/AdminProgramsPage';
import AdminNewsPage from './pages/admin/AdminNewsPage';
import AdminGalleryPage from './pages/admin/AdminGalleryPage';
import AdminResourcesPage from './pages/admin/AdminResourcesPage';
import AdminAspirationsPage from './pages/admin/AdminAspirationsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            {/* Public Routes with Navbar & Footer */}
            <Route
              path="/*"
              element={
                <div className="min-h-screen bg-[#050014] selection:bg-[#0200B5] selection:text-white flex flex-col">
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/structure" element={<StructurePage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Routes (Protected) */}
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
              <Route path="aspirations" element={<AdminAspirationsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
