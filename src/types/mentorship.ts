export interface Mentor {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  title: string | null;
  avatar: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

export interface MentorshipProgram {
  id: number;
  title: string;
  description: string;
  mentor_id: number;
  duration: string;
  capacity: number;
  status: string;
  category: string | null;
  created_at: string;
  updated_at: string;
  mentor: Mentor;
}

export type MentorshipStatus = 'open' | 'closed' | 'draft';
