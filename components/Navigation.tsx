import React from 'react';
import { Search, Briefcase, User, LogOut, Globe } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isMobile: boolean;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView, isMobile, onLogout }) => {
  const navItems = [
    { view: AppView.DISCOVERY, icon: Search, label: 'Discovery Matrix' },
    { view: AppView.BINDER, icon: Briefcase, label: 'My Binder' },
    { view: AppView.PROFILE, icon: User, label: 'Profile' },
  ];

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 px-6 flex justify-around items-center z-50 shadow-lg">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentView === item.view ? 'text-secondary' : 'text-slate-400'
            }`}
          >
            <item.icon size={22} strokeWidth={currentView === item.view ? 2.5 : 2} />
            <span className="text-[10px] font-semibold uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-slate-900 text-white flex flex-col z-50 shadow-2xl">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-secondary p-2 rounded-lg">
          <Globe size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">ImmiMatrix</h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest">Global Access</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all border border-transparent ${
              currentView === item.view 
                ? 'bg-slate-800 text-white border-slate-700 shadow-sm' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;