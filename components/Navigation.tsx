import React from 'react';
import { Home, MessageSquare, Newspaper, Bot, User as UserIcon, LogOut } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isMobile: boolean;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, isMobile, onLogout }) => {
  const navItems = [
    { view: AppView.DASHBOARD, icon: Home, label: 'Learn' },
    { view: AppView.NEWS, icon: Newspaper, label: 'Updates' },
    { view: AppView.ASSISTANT, icon: Bot, label: 'Immi' },
    { view: AppView.FORUM, icon: MessageSquare, label: 'Community' },
    { view: AppView.PROFILE, icon: UserIcon, label: 'Profile' },
  ];

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-between items-center z-50">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              currentView === item.view ? 'text-primary' : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            <item.icon size={24} strokeWidth={currentView === item.view ? 2.5 : 2} />
            <span className="text-xs font-bold mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    );
  }

  // Desktop Sidebar
  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 p-6 flex flex-col z-50">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xl">I</span>
        </div>
        <h1 className="text-2xl font-extrabold text-primary">Immigame</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              currentView === item.view 
                ? 'bg-blue-50 text-secondary border-2 border-secondary' 
                : 'text-gray-500 hover:bg-gray-100 border-2 border-transparent'
            }`}
          >
            <item.icon size={24} strokeWidth={2.5} />
            <span className="font-bold text-sm uppercase tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <button 
        onClick={onLogout}
        className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors mt-auto"
      >
        <LogOut size={24} />
        <span className="font-bold text-sm uppercase">Logout</span>
      </button>
    </div>
  );
};

export default Navigation;