import React, { useState } from 'react';
import { Search, ArrowRight, Clock, Calendar, AlertCircle } from 'lucide-react';
import { VisaOption, UserProfile } from '../types';
import { discoverVisaOptions } from '../services/geminiService';

interface DiscoveryMatrixProps {
  user: UserProfile;
  onStartApplication: (option: VisaOption) => void;
}

const DiscoveryMatrix: React.FC<DiscoveryMatrixProps> = ({ user, onStartApplication }) => {
  const [intent, setIntent] = useState('Work');
  const [results, setResults] = useState<VisaOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [startingId, setStartingId] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsSearching(true);
    setHasSearched(true);
    const data = await discoverVisaOptions(user.citizenship, intent);
    setResults(data);
    setIsSearching(false);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 pb-24">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Discovery Matrix</h2>
        <p className="text-slate-500">Analyze global privileges for <span className="font-semibold text-slate-900">{user.citizenship}</span> citizens.</p>
      </header>

      {/* Query Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-end md:items-center">
        <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">My Citizenship</label>
            <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium">
                {user.citizenship}
            </div>
        </div>
        <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Intent</label>
            <select 
                value={intent} 
                onChange={(e) => setIntent(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all font-medium text-slate-900"
            >
                <option value="Work">Work & Employment</option>
                <option value="Study">Higher Education</option>
                <option value="Tourism">Tourism & Short Stay</option>
                <option value="Invest">Investment & Business</option>
            </select>
        </div>
        <button 
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full md:w-auto px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
        >
            {isSearching ? 'Analyzing...' : <><Search size={18} /> Run Analysis</>}
        </button>
      </div>

      {/* Results Matrix */}
      {hasSearched && !isSearching && (
        <div className="grid grid-cols-1 gap-4">
            {results.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No viable routes found based on current treaties.</div>
            ) : (
                results.map((option) => (
                    <div key={option.id} className="bg-white rounded-xl border border-slate-200 hover:border-secondary transition-all shadow-sm flex flex-col md:flex-row p-6 items-start md:items-center gap-6 group">
                        
                        {/* Country / Title */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase tracking-wide">{option.country}</span>
                                {option.difficulty === 'Low' && <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">High Probability</span>}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">{option.visaName}</h3>
                            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{option.requirementsSummary}</p>
                        </div>

                        {/* Metrics Grid */}
                        <div className="flex gap-8 text-sm border-l border-slate-100 pl-6 border-t md:border-t-0 pt-4 md:pt-0 w-full md:w-auto">
                            <div>
                                <span className="block text-xs text-slate-400 mb-1 flex items-center gap-1"><Clock size={10} /> Processing</span>
                                <span className="font-semibold text-slate-700">{option.processingTime}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-400 mb-1 flex items-center gap-1"><Calendar size={10} /> Duration</span>
                                <span className="font-semibold text-slate-700">{option.maxDuration}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-400 mb-1 flex items-center gap-1"><AlertCircle size={10} /> Difficulty</span>
                                <span className={`font-semibold ${
                                    option.difficulty === 'High' ? 'text-red-600' : 
                                    option.difficulty === 'Medium' ? 'text-orange-600' : 
                                    'text-green-600'
                                }`}>{option.difficulty}</span>
                            </div>
                        </div>

                        {/* Action */}
                        <div className="w-full md:w-auto mt-4 md:mt-0">
                            <button 
                                onClick={() => {
                                    if (startingId) return;
                                    setStartingId(option.id);
                                    onStartApplication(option);
                                }}
                                disabled={startingId !== null}
                                className={`w-full md:w-auto bg-secondary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-colors ${
                                    startingId ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {startingId === option.id ? 'Starting...' : 'Start Application'}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
      )}
    </div>
  );
};

export default DiscoveryMatrix;