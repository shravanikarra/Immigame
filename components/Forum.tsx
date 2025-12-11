import React from 'react';
import { MessageSquare, Heart, Share2, MoreHorizontal } from 'lucide-react';
import { ForumPost } from '../types';

const MOCK_POSTS: ForumPost[] = [
  {
    id: '1',
    userId: 'u2',
    userName: 'Maria G.',
    userAvatar: 'https://picsum.photos/seed/maria/50/50',
    title: 'Just got my Green Card approved after 2 years! 🎉',
    content: 'It has been a long journey but I finally received the approval notice today. Don\'t lose hope everyone! The interview was actually much smoother than I expected.',
    likes: 142,
    comments: 23,
    timestamp: '2h ago',
    tags: ['Success Story', 'Green Card']
  },
  {
    id: '2',
    userId: 'u3',
    userName: 'Ahmed K.',
    userAvatar: 'https://picsum.photos/seed/ahmed/50/50',
    title: 'Question about RFE for birth certificate',
    content: 'I received a Request for Evidence stating my birth certificate translation is invalid. Has anyone else dealt with this specific issue from the NVC?',
    likes: 12,
    comments: 5,
    timestamp: '5h ago',
    tags: ['RFE', 'Help Needed']
  },
  {
    id: '3',
    userId: 'u4',
    userName: 'Li Wei',
    userAvatar: 'https://picsum.photos/seed/li/50/50',
    title: 'H1B Lottery second round chances?',
    content: 'Does anyone know the historical probability of a second lottery round for H1B caps? My employer is willing to wait but I am anxious.',
    likes: 45,
    comments: 18,
    timestamp: '1d ago',
    tags: ['Work Visa', 'H1B']
  }
];

const Forum: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto pb-24 pt-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-gray-800">Community</h2>
        <button className="bg-secondary hover:bg-secondaryDark text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors">
          + New Post
        </button>
      </div>

      <div className="space-y-4">
        {MOCK_POSTS.map(post => (
          <div key={post.id} className="bg-white p-4 rounded-2xl border-2 border-gray-100 hover:border-gray-200 transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <img src={post.userAvatar} alt={post.userName} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
              <div>
                <p className="font-bold text-gray-800 text-sm">{post.userName}</p>
                <p className="text-xs text-gray-400">{post.timestamp}</p>
              </div>
              <button className="ml-auto text-gray-300 hover:text-gray-500">
                <MoreHorizontal size={20} />
              </button>
            </div>
            
            <h3 className="font-bold text-lg text-gray-800 mb-2">{post.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.content}</p>
            
            <div className="flex gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg uppercase tracking-wide">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-6 border-t border-gray-100 pt-3">
              <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors group">
                <Heart size={20} className="group-hover:fill-current" />
                <span className="font-bold text-sm">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
                <MessageSquare size={20} />
                <span className="font-bold text-sm">{post.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-green-500 transition-colors ml-auto">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;