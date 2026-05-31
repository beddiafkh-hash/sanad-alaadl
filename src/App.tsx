import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SanadProvider, useSanad } from './context/SanadContext';
import { AppProvider, useAppContext } from './context/AppContext';
import { getGreetingData } from './utils/greetingHelper';
import { ToastProvider } from './components/ui/Toast';
import { SplashScreen } from './pages/SplashScreen';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import ClientsPage from './pages/Clients';
import CasesPage from './pages/Cases';
import SessionsPage from './pages/Sessions';
import FinancePage from './pages/Finance';
import { LegalPros } from './pages/LegalPros';
import { LegalServices } from './pages/LegalServices';
import LegalLibraryPage from './pages/LegalLibrary';
import { Appointments } from './pages/Appointments';
import { Templates } from './pages/Templates';
import { Reminders } from './pages/Reminders';
import { Notifications } from './pages/Notifications';
import { CommunicationHub } from './pages/CommunicationHub';
import { Settings } from './pages/Settings';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { LogoutModal } from './components/Layout/LogoutModal';
import { SanadAIPanel } from './components/AI/SanadAIPanel';
import { QuickSearch } from './components/AI/QuickSearch';
import TrashBinPage from './pages/TrashBin';
import ArchivePage from './pages/Archive';
import ReportsPage from './pages/Reports';
import TasksPage from './pages/Tasks';
import { soundHapticService } from './services/soundHapticService';

const AppContent: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const { state } = useAppContext();
  const { isPanelOpen, closePanel, isSearchOpen, closeSearch } = useSanad();
  const [showSplash, setShowSplash] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const location = useLocation();

  const greetingData = React.useMemo(() => {
    const name = state?.settings?.greetingName || 'الأستاذ إسكندر';
    const forcedHoliday = soundHapticService?.getSettings?.()?.forcedHoliday || 'none';
    return getGreetingData(name, new Date(), forcedHoliday);
  }, [state?.settings?.greetingName]);

  const holidayBackgroundClass = React.useMemo(() => {
    if (greetingData.category !== 'holiday') return 'bg-[#030b1a]';
    switch (greetingData.holidayId) {
      case 'ramadan':
        return 'bg-gradient-to-tr from-[#011c0c] via-[#021f2d] to-[#01140d]';
      case 'eid_fitr':
        return 'bg-gradient-to-tr from-[#1c0827] via-[#05061b] to-[#120422]';
      case 'eid_adha':
        return 'bg-gradient-to-tr from-[#0f2214] via-[#051410] to-[#03020c]';
      case 'new_year':
        return 'bg-gradient-to-tr from-[#040e35] via-[#0c0525] to-[#03030f]';
      case 'hijri_new_year':
        return 'bg-gradient-to-tr from-[#001f1f] via-[#011417] to-[#030b1a]';
      default:
        return 'bg-[#030b1a]';
    }
  }, [greetingData.category, greetingData.holidayId]);

  // Track page entries to play section-specific sounds/haptics, and launch background ambient
  React.useEffect(() => {
    if (showSplash || !user) return;
    
    // Play section sound and haptics
    const path = location.pathname;
    let sectionId = '';
    if (path === '/dashboard' || path === '/') sectionId = 'dashboard';
    else if (path.startsWith('/clients')) sectionId = 'clients';
    else if (path.startsWith('/cases')) sectionId = 'cases';
    else if (path.startsWith('/sessions')) sectionId = 'sessions';
    else if (path.startsWith('/finance')) sectionId = 'finance';
    else if (path.startsWith('/library')) sectionId = 'library';
    else if (path.startsWith('/settings')) sectionId = 'settings';
    else if (path.startsWith('/vault')) sectionId = 'vault';
    else if (path.startsWith('/communication')) sectionId = 'communication';
    else if (path.startsWith('/reports')) sectionId = 'reports';

    if (sectionId) {
      soundHapticService.playSectionEntry(sectionId);
    }
  }, [location.pathname, showSplash, user]);

  React.useEffect(() => {
    if (!showSplash && user) {
      soundHapticService.startAmbient();
    }
    return () => {
      soundHapticService.stopAmbient();
    };
  }, [showSplash, user]);

  const handleLogoutConfirm = () => {
    setIsLogoutOpen(false);
    logout();
  };

  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030b1a] flex items-center justify-center">
         <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
      ) : !user ? (
        <Login key="login" />
      ) : (
        <div className={`min-h-screen text-white selection:bg-gold/30 selection:text-gold overflow-x-hidden transition-colors duration-1000 ${holidayBackgroundClass}`}>
          <Header 
            onMenuToggle={() => {
              if (window.innerWidth < 1024) {
                setIsSidebarOpen(!isSidebarOpen);
              } else {
                setIsSidebarHidden(!isSidebarHidden);
              }
            }} 
            onLogoutClick={() => setIsLogoutOpen(true)}
            className="z-40"
          />
          
          <div className="flex flex-row w-full min-h-screen relative">
            <Sidebar 
              isOpen={isSidebarOpen} 
              onClose={() => setIsSidebarOpen(false)} 
              isExpanded={isSidebarExpanded}
              setIsExpanded={setIsSidebarExpanded}
              isHidden={isSidebarHidden}
              setIsHidden={setIsSidebarHidden}
              onLogoutClick={() => setIsLogoutOpen(true)}
            />
            {/* Flexbox spacing element that physically pushes/folds the adjacent main canvas */}
            <div className={`transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${!isSidebarHidden ? 'hidden lg:block lg:w-[280px]' : 'w-0'}`} />
            
            <main className="flex-1 transition-all duration-300 ease-in-out pt-[164px] md:pt-[200px] xl:pt-[240px] px-0 min-w-0">
              <div className="max-w-[1600px] mx-auto w-full px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 overflow-hidden">
                <Routes>
                {/* ... existing routes ... */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/clients" element={
                  <ClientsPage 
                    navSidebarExpanded={isSidebarExpanded} 
                    navSidebarHidden={isSidebarHidden} 
                  />
                } />
                <Route path="/cases" element={
                  <CasesPage 
                    navSidebarExpanded={isSidebarExpanded} 
                    navSidebarHidden={isSidebarHidden} 
                  />
                } />
                <Route path="/sessions" element={
                  <SessionsPage 
                    navSidebarExpanded={isSidebarExpanded} 
                    navSidebarHidden={isSidebarHidden} 
                  />
                } />
                <Route path="/finance" element={
                  <FinancePage 
                    navSidebarExpanded={isSidebarExpanded} 
                    navSidebarHidden={isSidebarHidden} 
                  />
                } />
                <Route path="/law-professionals" element={<LegalPros />} />
                <Route path="/legal-services" element={<LegalServices />} />
                <Route path="/library" element={
                  <LegalLibraryPage 
                    navSidebarExpanded={isSidebarExpanded} 
                    navSidebarHidden={isSidebarHidden} 
                  />
                } />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/communication" element={<CommunicationHub />} />
                <Route path="/vault" element={<CommunicationHub />} />
                <Route path="/trash" element={
                  <TrashBinPage 
                    navSidebarExpanded={isSidebarExpanded} 
                    navSidebarHidden={isSidebarHidden} 
                  />
                } />
                <Route path="/archive" element={
                  <ArchivePage 
                    navSidebarExpanded={isSidebarExpanded} 
                    navSidebarHidden={isSidebarHidden} 
                  />
                } />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<div className="p-20 text-center text-gold/50">الصفحة قيد التطوير...</div>} />
              </Routes>
            </div>
          </main>
        </div>

            <SanadAIPanel isOpen={isPanelOpen} onClose={closePanel} />
            <QuickSearch isOpen={isSearchOpen} onClose={closeSearch} />
            <LogoutModal 
              isOpen={isLogoutOpen} 
              onClose={() => setIsLogoutOpen(false)} 
              onConfirm={handleLogoutConfirm}
            />
            {/* Unneeded secondary button since the global Header supports mobile sidebars across all screens */}
          </div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <ThemeProvider>
            <SanadProvider>
              <ToastProvider>
                <AppContent />
              </ToastProvider>
            </SanadProvider>
          </ThemeProvider>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}
