import React, { useEffect, useState } from 'react';
import { Check, Lock, Star, Plane, FileText, Home, GraduationCap, RefreshCw } from 'lucide-react';
import { Stage, User } from '../types';
import { generateGamifiedStages } from '../services/geminiService';

interface DashboardProps {
  user: User;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Plane': return Plane;
    case 'Home': return Home;
    case 'GraduationCap': return GraduationCap;
    case 'Passport': return FileText;
    default: return FileText;
  }
};

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStages = async () => {
    setLoading(true);
    // Simulate caching or first load
    const data = await generateGamifiedStages(user.originCountry, user.destinationCountry);
    setStages(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-2xl mx-auto pb-24 pt-6 px-4">
      <header className="flex justify-between items-center mb-8 sticky top-0 bg-[#F7F7F7] z-10 py-2">
        <div>
          <h2 className="text-2xl font-black text-gray-800">My Journey</h2>
          <p className="text-gray-500 font-semibold">{user.originCountry} ➝ {user.destinationCountry}</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
                <img src="https://d35aaqx5ub95lt.cloudfront.net/images/gems/45c14e05be9c1af1d7d0b9e84371e87f.svg" className="w-7 h-7" alt="gems" />
                <span className="font-bold text-secondary">{user.xp} XP</span>
            </div>
             <div className="flex items-center gap-1">
                <img src="https://d35aaqx5ub95lt.cloudfront.net/images/streak/4f3842c690acf9bf9d4af718174f96aa.svg" className="w-6 h-6" alt="fire" />
                <span className="font-bold text-orange-500">{user.streak}</span>
            </div>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-500 font-bold animate-pulse">Consulting AI for latest protocols...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded mb-6 flex justify-between items-center">
             <div>
                <p className="font-bold">Latest Roadmap</p>
                <p className="text-sm">Updated via AI based on current visa bulletins.</p>
             </div>
             <button onClick={loadStages} className="p-2 bg-white rounded-full shadow hover:bg-blue-50 text-blue-500">
                <RefreshCw size={18} />
             </button>
          </div>

          {stages.map((stage, index) => {
            const Icon = getIcon(stage.icon);
            const isLocked = stage.status === 'locked';
            const isActive = stage.status === 'active';
            const isCompleted = stage.status === 'completed';

            // Offset logic for winding path visual
            const offset = index % 2 === 0 ? '0px' : index % 4 === 1 ? '50px' : '-50px';

            return (
              <div 
                key={stage.id} 
                className="relative flex flex-col items-center"
                style={{ marginLeft: offset }}
              >
                {/* Connector Line (except for last item) */}
                {index < stages.length - 1 && (
                   <div className="absolute top-16 w-3 h-16 bg-gray-200 -z-10 rounded-full"></div>
                )}

                <button
                  disabled={isLocked}
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center mb-2 border-b-8 active:border-b-0 active:translate-y-2 transition-all relative
                    ${isLocked ? 'bg-gray-200 border-gray-300 text-gray-400' : ''}
                    ${isActive ? 'bg-primary border-primaryDark text-white ring-8 ring-green-100' : ''}
                    ${isCompleted ? 'bg-accent border-yellow-600 text-yellow-900' : ''}
                  `}
                >
                  {isCompleted ? <Check strokeWidth={4} /> : isLocked ? <Lock /> : <Icon size={32} fill="currentColor" />}
                  
                  {/* Floating tooltip for active stage */}
                  {isActive && (
                      <div className="absolute -top-12 bg-white px-3 py-1 rounded-xl border-2 border-gray-200 shadow-sm whitespace-nowrap">
                          <span className="text-primary font-extrabold uppercase text-xs">Start</span>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-200"></div>
                      </div>
                  )}
                </button>

                <h3 className={`font-bold text-lg ${isLocked ? 'text-gray-400' : 'text-gray-700'}`}>
                    {stage.title}
                </h3>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="h-20"></div> {/* Spacer */}
    </div>
  );
};

export default Dashboard;