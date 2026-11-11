import React, { useState } from 'react';
import { Logo } from './Logo.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Sparkles,
  ShieldAlert,
  GraduationCap,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  Award,
  ChevronDown,
} from 'lucide-react';
import { UserRole } from '../../types/index.ts';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, param?: any) => void;
  siteLogoUrl?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, siteLogoUrl }) => {
  const { currentUser, signInWithGoogle, loginAsDemoUser, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', tab: 'home' },
    { label: 'All Courses', tab: 'courses' },
    { label: 'Free Tracks', tab: 'free-courses' },
    { label: 'Paid Pro', tab: 'paid-courses' },
    { label: 'Our Team', tab: 'team' },
    { label: 'Founder', tab: 'founder' },
    { label: 'About Us', tab: 'about' },
    { label: 'Projects', tab: 'projects' },
    { label: 'FAQ', tab: 'faq' },
    { label: 'Contact', tab: 'contact' },
  ];

  const handleDemoSwitch = (role: UserRole) => {
    loginAsDemoUser(role);
    setDemoDropdownOpen(false);
    if (role === 'super_admin') onNavigate('admin');
    else if (role === 'teacher') onNavigate('teacher');
    else onNavigate('student');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#030712]/90 backdrop-blur-md border-b border-cyan-500/20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div
            className="cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <Logo customLogoUrl={siteLogoUrl} size="md" />
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentTab === link.tab;
              return (
                <button
                  key={link.tab}
                  onClick={() => onNavigate(link.tab)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-amber-400 bg-amber-400/10 font-semibold shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Right Section / Auth & Portals */}
          <div className="hidden md:flex items-center gap-3">
            {/* Verify Certificate Quick Link */}
            <button
              onClick={() => onNavigate('verify-certificate')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-amber-300 bg-slate-900/60 border border-slate-700/60 rounded-lg hover:border-amber-400/40 transition-all"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Verify Cert</span>
            </button>

            {/* Instant Role Switcher for Testing & Demonstration */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500/20 to-blue-500/20 border border-amber-500/30 text-amber-300 hover:border-amber-400 transition-all"
                title="Switch role for instant evaluation"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                <span>Switch Portal</span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
              </button>

              {demoDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0f1c3d] border border-slate-700 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10">
                    Switch Active Persona (Demo)
                  </div>
                  <button
                    onClick={() => handleDemoSwitch('super_admin')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-amber-500/15 text-slate-200 hover:text-amber-300 transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-bold">Super Admin / Founder</div>
                      <div className="text-[10px] text-slate-400">Zohaib Ali (Owner Control)</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('teacher')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-blue-500/15 text-slate-200 hover:text-blue-300 transition-colors"
                  >
                    <GraduationCap className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="font-bold">Faculty Teacher</div>
                      <div className="text-[10px] text-slate-400">Dr. Ahmed Khan (Course Manager)</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDemoSwitch('student')}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-emerald-500/15 text-slate-200 hover:text-emerald-300 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-bold">Enrolled Student</div>
                      <div className="text-[10px] text-slate-400">Ali Raza (Learning Portal)</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* User Profile or Google Sign In */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-slate-500 transition-all"
                >
                  {currentUser.profileImage ? (
                    <img
                      src={currentUser.profileImage}
                      alt={currentUser.fullName}
                      className="w-7 h-7 rounded-full object-cover border border-amber-400/40"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                      {currentUser.fullName.charAt(0)}
                    </div>
                  )}
                  <div className="text-left leading-tight hidden xl:block">
                    <span className="text-xs font-semibold text-white block truncate max-w-[120px]">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[10px] text-amber-400 capitalize block">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0f1c3d] border border-slate-700 shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-xs font-bold text-white">{currentUser.fullName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    </div>

                    {/* Portal Shortcut */}
                    {currentUser.role === 'super_admin' && (
                      <button
                        onClick={() => {
                          onNavigate('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-amber-300 font-bold hover:bg-amber-500/15 flex items-center gap-2"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        Owner Control Center
                      </button>
                    )}

                    {currentUser.role === 'teacher' && (
                      <button
                        onClick={() => {
                          onNavigate('teacher');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-blue-300 font-bold hover:bg-blue-500/15 flex items-center gap-2"
                      >
                        <GraduationCap className="w-4 h-4 text-blue-400" />
                        Teacher Portal
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onNavigate('student');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-white/5 flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      My Student Dashboard
                    </button>

                    <button
                      onClick={() => {
                        signOut();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 border-t border-white/10 mt-1"
                    >
                      <LogOut className="w-4 h-4 text-red-400" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Student Sign In</span>
                </button>
              </div>
            )}

            {/* Direct Admin Center Button if Super Admin */}
            {currentUser?.role === 'super_admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 transition-all"
              >
                Owner Center
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleDemoSwitch('super_admin')}
              className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/40"
              title="Super Admin"
            >
              Admin
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a1128] border-b border-white/10 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.tab}
              onClick={() => {
                onNavigate(link.tab);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/10"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigate('verify-certificate');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-amber-300"
            >
              Verify Certificate
            </button>
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    onNavigate('student');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-blue-400"
                >
                  My Student Dashboard ({currentUser.fullName})
                </button>
                {currentUser.role === 'super_admin' && (
                  <button
                    onClick={() => {
                      onNavigate('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-amber-400"
                  >
                    Owner Control Center
                  </button>
                )}
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-red-400"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  signInWithGoogle();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-lg"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
