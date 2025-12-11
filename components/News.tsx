import React, { useEffect, useState } from 'react';
import { Newspaper, AlertTriangle, ExternalLink, Calendar } from 'lucide-react';
import { NewsUpdate } from '../types';
import { getImmigrationNews } from '../services/geminiService';

const News: React.FC = () => {
  const [news, setNews] = useState<NewsUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const data = await getImmigrationNews();
      setNews(data);
      setLoading(false);
    };
    fetchNews();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24 pt-6">
      <header className="mb-8">
        <h2 className="text-3xl font-black text-gray-800 mb-2">Immigration Updates</h2>
        <p className="text-gray-500 font-medium">Real-time policy changes monitored by AI.</p>
      </header>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border-2 border-gray-100 shadow-sm hover:border-blue-100 transition-all">
              <div className="flex justify-between items-start mb-2">
                <div className={`px-2 py-1 rounded-lg text-xs font-bold uppercase ${
                  item.impactLevel === 'high' ? 'bg-red-100 text-red-600' :
                  item.impactLevel === 'medium' ? 'bg-orange-100 text-orange-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {item.impactLevel} Impact
                </div>
                <div className="flex items-center text-gray-400 text-xs font-bold">
                    <Calendar size={12} className="mr-1"/>
                    {item.date}
                </div>
              </div>
              
              <h3 className="font-bold text-lg text-gray-800 mb-2">{item.headline}</h3>
              <p className="text-gray-600 leading-relaxed text-sm mb-4">{item.summary}</p>
              
              {item.sourceUrl && (
                <a 
                  href={item.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-secondary font-bold text-sm hover:underline"
                >
                  Read Source <ExternalLink size={14} className="ml-1" />
                </a>
              )}
            </div>
          ))}
          
          <div className="p-4 bg-gray-100 rounded-xl text-center">
             <p className="text-xs text-gray-500 font-medium">
               Disclaimer: AI generated summaries. Always consult an attorney for legal advice.
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;