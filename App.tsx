import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Assistant from './components/Assistant';
import Forum from './components/Forum';
import News from './components/News';
import Auth from './components/Auth';
import { AppView, User } from './types';

// Mock initial user
const INITIAL_USER: User = {
  id: 'user-1',
  name: 'Alex',
  avatar: 'https://picsum.photos/seed/alex/100/100',
  xp: 1250,
  streak: 5,
  currentStageId: '2',
  originCountry: 'Mexico',
  destinationCountry: 'United States'
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogin = () => {
    // In a real app, this would verify credentials
    setUser(INITIAL_USER);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(AppView.LOGIN);
  };

  // Render Logic
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard user={user} />;
      case AppView.ASSISTANT:
        return <Assistant />;
      case AppView.NEWS:
        return <News />;
      case AppView.FORUM:
        return <Forum />;
      case AppView.PROFILE:
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <img src={user.avatar} className="w-32 h-32 rounded-full border-4 border-gray-100 mb-4" alt="profile"/>
                <h2 className="text-3xl font-black text-gray-800">{user.name}</h2>
                <p className="text-gray-500 font-bold text-lg mb-8">{user.originCountry} → {user.destinationCountry}</p>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl w-full max-w-xs"
                >
                    Sign Out
                </button>
            </div>
        );
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F7F7]">
      <Navigation 
        currentView={currentView} 
        setView={setCurrentView} 
        isMobile={isMobile} 
        onLogout={handleLogout}
      />
      
      <main className={`flex-1 ${isMobile ? 'mb-16' : 'ml-64'} transition-all duration-300`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;