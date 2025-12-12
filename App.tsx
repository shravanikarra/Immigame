import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import DiscoveryMatrix from './components/DiscoveryMatrix';
import ApplicationBinder from './components/ApplicationBinder';
import Auth from './components/Auth';
import { AppView, UserProfile, VisaOption, ApplicationInstance } from './types';
import { generateApplicationChecklist } from './services/geminiService';

// Mock initial user
const INITIAL_USER: UserProfile = {
  id: 'u1',
  name: 'Arjun Gupta',
  citizenship: 'India'
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DISCOVERY);
  const [applications, setApplications] = useState<ApplicationInstance[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogin = () => {
    setUser(INITIAL_USER);
    setCurrentView(AppView.DISCOVERY);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleStartApplication = async (option: VisaOption) => {
    // 0. Check for existing application to prevent duplicates
    const existingAppIndex = applications.findIndex(
        app => app.visaOption.country === option.country && app.visaOption.visaName === option.visaName
    );

    if (existingAppIndex !== -1) {
        // If exists, move it to the top (so it's selected in Binder) and switch view
        const existingApp = applications[existingAppIndex];
        const otherApps = applications.filter((_, idx) => idx !== existingAppIndex);
        setApplications([existingApp, ...otherApps]);
        setCurrentView(AppView.BINDER);
        return;
    }

    // 1. Fetch the static checklist (Snapshot pattern)
    const steps = await generateApplicationChecklist(option.visaName, option.country);
    
    // 2. Create new instance
    const newApp: ApplicationInstance = {
      id: `app-${Date.now()}`,
      visaOption: option,
      startDate: new Date().toLocaleDateString(),
      progress: 0,
      currentStepIndex: 0,
      steps: steps
    };

    setApplications(prev => [newApp, ...prev]);
    setCurrentView(AppView.BINDER);
  };

  const handleUpdateProgress = (appId: string, stepId: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;

      // Update steps logic
      const newSteps = app.steps.map((step, idx) => {
        if (step.id === stepId) {
            return { ...step, isCompleted: true, status: 'completed' as const };
        }
        // Unlock next step
        if (idx > 0 && app.steps[idx - 1].id === stepId) {
             return { ...step, status: 'active' as const };
        }
        return step;
      });

      // Simple unlock next logic for the immediate next one if previous completed
      const currentIndex = app.steps.findIndex(s => s.id === stepId);
      if (currentIndex !== -1 && currentIndex < app.steps.length - 1) {
          newSteps[currentIndex + 1].status = 'active';
      }

      const completedCount = newSteps.filter(s => s.isCompleted).length;
      const progress = (completedCount / newSteps.length) * 100;

      return {
        ...app,
        steps: newSteps,
        progress
      };
    }));
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.DISCOVERY:
        return <DiscoveryMatrix user={user} onStartApplication={handleStartApplication} />;
      case AppView.BINDER:
        return <ApplicationBinder applications={applications} onUpdateProgress={handleUpdateProgress} />;
      case AppView.PROFILE:
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white">
                <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                    {user.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                <p className="text-slate-500 font-medium mb-8">Citizenship: {user.citizenship}</p>
                <button 
                  onClick={handleLogout}
                  className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                    Sign Out
                </button>
            </div>
        );
      default:
        return <DiscoveryMatrix user={user} onStartApplication={handleStartApplication} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Navigation 
        currentView={currentView} 
        setView={setCurrentView} 
        isMobile={isMobile} 
        onLogout={handleLogout}
      />
      
      <main className={`flex-1 ${isMobile ? 'mb-20' : 'ml-64'} transition-all duration-300`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;