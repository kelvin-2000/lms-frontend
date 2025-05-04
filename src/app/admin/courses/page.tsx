'use client';
import React from 'react';
import CourseManagement from '@/components/courses/CourseManagement';
import { getCourses } from '@/services/courseService';

const CoursesPage = async () => {
  const courses = await getCourses();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Courses</h1>
      <CourseManagement
        courses={courses}
        onCoursesUpdated={() => window.location.reload()}
      />
    </div>
  );
};

export default CoursesPage;
