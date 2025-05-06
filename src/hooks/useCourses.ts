import { useState, useEffect } from 'react';
import courseService, { Course } from '@/services/course.service';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [latestCourses, setLatestCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const [all, featured, popular, latest] = await Promise.all([
          courseService.getAllCourses(),
          courseService.getFeaturedCourses(),
          courseService.getPopularCourses(),
          courseService.getLatestCourses(),
        ]);
        setCourses(all);
        setFeaturedCourses(featured);
        setPopularCourses(popular);
        setLatestCourses(latest);
      } catch (err) {
        setError('Failed to fetch courses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return {
    courses,
    featuredCourses,
    popularCourses,
    latestCourses,
    loading,
    error,
  };
};
