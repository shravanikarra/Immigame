import React, { useState } from 'react';
import { CheckCircle, Lock, FileText, ChevronRight, Briefcase } from 'lucide-react';
import { ApplicationInstance } from '../types';

interface ApplicationBinderProps {
  applications: ApplicationInstance[];
  onUpdateProgress: (appId: string, stepId: string) => void;
}

const ApplicationBinder: React.FC<ApplicationBinderProps> = ({ applications, onUpdateProgress }) => {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(
    applications.length > 0 ? applications[0].id : null
  );

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-slate-400">
        <Briefcase size={64} className="mb-4 text-slate-200" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">Binder is Empty</h3>
        <p className="max-w-md text-center">Use the Discovery Matrix to find a visa option and start an application instance. It will appear here.</p>
      </div>
    );
  }

  const activeApp = applications.find(a => a.id === selectedAppId) || applications[0];

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Sidebar List of Apps */}
      <div className="w-full md:w-80 bg-white border-r border-slate-200 overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Active Instances</h2>
        </div>
        {applications.map(app => (
            <button
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                className={`w-full text-left p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex justify-between items-center group ${
                    selectedAppId === app.id ? 'bg-slate-50 border-l-4 border-l-secondary' : 'border-l-4 border-l-transparent'
                }`}
            >
                <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">{app.visaOption.country}</span>
                    <h3 className="font-semibold text-slate-900">{app.visaOption.visaName}</h3>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-success transition-all duration-500" style={{ width: `${app.progress}%` }}></div>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{Math.round(app.progress)}%</span>
                    </div>
                </div>
                <ChevronRight size={16} className={`text-slate-300 ${selectedAppId === app.id ? 'text-secondary' : ''}`} />
            </button>
        ))}
      </div>

      {/* Main Checklist View */}
      <div className="flex-1 bg-slate-50 p-6 md:p-10 overflow-y-auto pb-24">
        {activeApp && (
            <div className="max-w-3xl mx-auto">
                <header className="mb-8 border-b border-slate-200 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-slate-200 text-slate-600 px-2 py-1 text-xs font-bold rounded uppercase">Application ID: {activeApp.id.split('-')[1]}</span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 text-xs font-bold rounded uppercase">Status: Active</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">{activeApp.visaOption.visaName} — {activeApp.visaOption.country}</h1>
                    <p className="text-slate-500 mt-1">Snapshot created on {activeApp.startDate}. Steps are fixed to this date.</p>
                </header>

                <div className="space-y-6 relative">
                    {/* Vertical connector line */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200 -z-0"></div>

                    {activeApp.steps.map((step, index) => {
                        const isActive = step.status === 'active';
                        const isLocked = step.status === 'locked';
                        const isCompleted = step.status === 'completed';

                        return (
                            <div key={step.id} className={`relative flex gap-6 z-10 group ${isLocked ? 'opacity-50' : ''}`}>
                                {/* Icon Bubble */}
                                <div className={`
                                    w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border-4 transition-all bg-white
                                    ${isCompleted ? 'border-success text-success' : 
                                      isActive ? 'border-secondary text-secondary shadow-lg scale-110' : 
                                      'border-slate-200 text-slate-300'}
                                `}>
                                    {isCompleted ? <CheckCircle size={20} fill="currentColor" className="text-white" /> : 
                                     isLocked ? <Lock size={16} /> : 
                                     <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>}
                                </div>

                                {/* Content Card */}
                                <div className={`
                                    flex-1 bg-white rounded-xl border p-5 transition-all
                                    ${isActive ? 'border-secondary ring-1 ring-secondary/20 shadow-md' : 'border-slate-200 shadow-sm'}
                                `}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className={`font-bold text-lg ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>
                                            Step {index + 1}: {step.title}
                                        </h4>
                                        {step.requiredDoc && (
                                            <span className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                                <FileText size={12} /> {step.requiredDoc}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{step.description}</p>
                                    
                                    {!isLocked && !isCompleted && (
                                        <button 
                                            onClick={() => onUpdateProgress(activeApp.id, step.id)}
                                            className="text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Mark as Complete
                                        </button>
                                    )}
                                    {isCompleted && (
                                        <span className="text-sm font-bold text-success flex items-center gap-1">
                                            Completed on {new Date().toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationBinder;