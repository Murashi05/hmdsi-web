import { type ReactNode, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Image,
  FolderOpen,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Users, label: 'Members', path: '/admin/members' },
  { icon: Briefcase, label: 'Proker', path: '/admin/programs' },
  { icon: FileText, label: 'News', path: '/admin/news' },
  { icon: Image, label: 'Gallery', path: '/admin/gallery' },
  { icon: FolderOpen, label: 'Resources', path: '/admin/resources' },
  { icon: MessageSquare, label: 'Aspirations', path: '/admin/aspirations' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const Sidebar = ({ collapsed = false }: { collapsed?: boolean }) => (
    <aside
      className={`hidden lg:flex flex-col bg-[#0a0a1a] border-r border-white/5 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-5 border-b border-white/5">
        <img src="/images/hmdsi.svg" alt="HMDSI" className="w-10 h-10 shrink-0" />
        {!collapsed && (
          <div>
            <div className="text-white font-sans font-bold text-sm">HMDSI Admin</div>
            <div className="text-white/30 text-xs font-sans">CMS Dashboard</div>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-5 py-3 transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-[#0200B5]/10 text-[#0200B5] border-r-2 border-[#0200B5]'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm font-sans font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-white/5">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3 mb-3'}`}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0200B5] to-[#0000F0] flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-sans font-medium truncate">{user?.name}</div>
              <div className="text-white/30 text-xs font-sans capitalize">{user?.role?.replace('_', ' ')}</div>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-sm font-sans">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setSidebarCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-[#0a0a1a] border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors"
      >
        <ChevronLeft className={`w-3 h-3 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
      </button>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-[#050014]">
      {/* Desktop Sidebar */}
      <div className="relative">
        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#0a0a1a] z-50 lg:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <img src="/images/hmdsi.svg" alt="HMDSI" className="w-10 h-10" />
                  <div>
                    <div className="text-white font-sans font-bold text-sm">HMDSI Admin</div>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="py-4">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-5 py-3 transition-all ${
                      isActive(item.path)
                        ? 'bg-[#0200B5]/10 text-[#0200B5]'
                        : 'text-white/50 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-sans font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0200B5] to-[#0000F0] flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-sans font-medium truncate">{user?.name}</div>
                    <div className="text-white/30 text-xs font-sans capitalize">{user?.role?.replace('_', ' ')}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-sans">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#050014]/90 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-white/60 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-white font-sans font-bold text-lg capitalize">
                  {navItems.find((item) => isActive(item.path))?.label || 'Dashboard'}
                </h1>
              </div>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white text-sm font-sans flex items-center gap-2"
            >
              View Website
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
