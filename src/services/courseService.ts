import axios from 'axios';
import { Course } from '@/types/courses';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createCourse = async (courseData: Omit<Course, 'id'>) => {
  const response = await axios.post(`${API_URL}/courses`, courseData, {
    withCredentials: true,
  });
  return response.data;
};

export const updateCourse = async (
  courseId: string,
  courseData: Partial<Course>,
) => {
  const response = await axios.put(
    `${API_URL}/courses/${courseId}`,
    courseData,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

export const deleteCourse = async (courseId: string) => {
  const response = await axios.delete(`${API_URL}/courses/${courseId}`, {
    withCredentials: true,
  });
  return response.data;
};

export const getCourses = async () => {
  const response = await axios.get(`${API_URL}/courses`, {
    withCredentials: true,
  });
  return response.data;
};

export const getCourseById = async (courseId: string) => {
  const response = await axios.get(`${API_URL}/courses/${courseId}`, {
    withCredentials: true,
  });
  return response.data;
};
