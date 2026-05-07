// Shared app types: describes common records used across the academy app.
export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'training' | 'tournament' | 'camp' | 'tryout';
  image_url?: string;
  location?: string;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  position?: string;
  team?: string;
  avatar_url?: string;
  bio?: string;
  role: 'admin' | 'coach' | 'player' | 'staff';
  created_at: string;
  updated_at: string;
};

export type News = {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  image_url?: string;
  published_at: string;
  author_id: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  email: string;
  role?: string;
};
