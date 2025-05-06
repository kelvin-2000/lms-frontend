import { BaseService } from './base.service';
import api from './api';

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnailUrl: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  totalVideos: number;
  price: number | 'Free';
  rating: number;
  ratingCount: number;
  studentsCount: number;
  lastUpdate: string;
  requirements: string[];
  whatYouWillLearn: string[];
  instructor: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    title: string;
  };
  videos: {
    id: string;
    title: string;
    duration: string;
    videoUrl: string;
    isFree: boolean;
  }[];
  discussions: {
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    title: string;
    content: string;
    date: string;
    replies: number;
  }[];
}

export interface CourseVideo {
  id: number;
  course_id: number;
  title: string;
  description: string;
  video_url: string;
  duration: number;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  progress: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export class CourseService extends BaseService {
  async getCourse(id: string): Promise<Course> {
    return this.get<Course>(`/courses/${id}`);
  }

  async enrollInCourse(
    courseId: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.post(`/courses/${courseId}/enroll`);
  }

  async getCourses(): Promise<Course[]> {
    return this.get<Course[]>('/courses');
  }

  async createDiscussion(
    courseId: string,
    data: { title: string; content: string },
  ): Promise<{ success: boolean; message: string }> {
    return this.post(`/courses/${courseId}/discussions`, data);
  }

  // Public routes
  async getFeaturedCourses(): Promise<Course[]> {
    const response = await api.get<Course[]>('/courses/featured');
    return response.data;
  }

  async getPopularCourses(): Promise<Course[]> {
    const response = await api.get<Course[]>('/courses/popular');
    return response.data;
  }

  async getLatestCourses(): Promise<Course[]> {
    const response = await api.get<Course[]>('/courses/latest');
    return response.data;
  }

  // Protected routes
  async createCourse(
    data: Omit<Course, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Course> {
    const response = await api.post<Course>('/courses', data);
    return response.data;
  }

  async updateCourse(id: number, data: Partial<Course>): Promise<Course> {
    const response = await api.put<Course>(`/courses/${id}`, data);
    return response.data;
  }

  async deleteCourse(id: number): Promise<void> {
    await api.delete(`/courses/${id}`);
  }

  async getCourseVideos(courseId: number): Promise<CourseVideo[]> {
    const response = await api.get<CourseVideo[]>(
      `/courses/${courseId}/videos`,
    );
    return response.data;
  }

  async getCourseDiscussions(courseId: number): Promise<any[]> {
    const response = await api.get<any[]>(`/courses/${courseId}/discussions`);
    return response.data;
  }

  async getCourseEnrollments(courseId: number): Promise<Enrollment[]> {
    const response = await api.get<Enrollment[]>(
      `/courses/${courseId}/enrollments`,
    );
    return response.data;
  }
}

export const courseService = new CourseService();
