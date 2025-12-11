export interface User {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  currentStageId: string;
  originCountry: string;
  destinationCountry: string;
}

export interface Stage {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'active' | 'completed';
  type: 'quiz' | 'document' | 'info';
  icon: string; // Lucide icon name or similar
}

export interface ForumPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface NewsUpdate {
  id: string;
  headline: string;
  summary: string;
  sourceUrl?: string;
  date: string;
  impactLevel: 'low' | 'medium' | 'high';
}

export enum AppView {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  FORUM = 'FORUM',
  ASSISTANT = 'ASSISTANT',
  NEWS = 'NEWS',
  PROFILE = 'PROFILE'
}