export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  long_description: string;
  learning_outcomes?: string[];
  requirements?: string[] | null;
  what_you_will_learn?: string | null;
  category: string;
  level: string;
  price: number;
  duration?: number;
  status: string;
  thumbnail?: string;
  thumbnail_url?: string;
  thumbnail_url_path?: string;
  rating?: string;
  rating_count?: number;
  students_count?: number;
  instructor_id?: number;
  instructor?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    title?: string | null;
    role?: string;
  };
  sections?: any[];
  total_videos?: number;
  created_at?: string;
  updated_at?: string;
  last_update?: string | null;
}
