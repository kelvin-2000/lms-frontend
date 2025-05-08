import { Course } from '@/types';
import { getAuthToken } from '@/utils/auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Using the imported getAuthToken function from @/utils/auth

export interface CourseCreateData {
  title: string;
  slug: string;
  short_description: string;
  description?: string;
  long_description: string;
  learning_outcomes: string[];
  requirements: string[];
  category: string;
  level: string;
  price: number;
  status: string;
  thumbnail_url: string;
  duration: number;
}

export interface CourseVideo {
  id: number;
  course_id: number;
  title: string;
  description: string;
  video_url: string;
  duration: number;
  position: number;
  created_at?: string;
  updated_at?: string;
}

export interface CourseVideoCreateData {
  course_id: number;
  title: string;
  description: string;
  video_url: string;
  duration: number;
  position: number;
}

export interface CourseDiscussion {
  id: number;
  course_id: number;
  user_id: number;
  user_name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CourseEnrollment {
  id: number;
  course_id: number;
  user_id: number;
  user_name: string;
  created_at: string;
  status: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
}

export interface PaginatedCourseResponse {
  data: Course[];
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
  from?: number;
  to?: number;
  next_page_url?: string | null;
  prev_page_url?: string | null;
}

// Add API error interface
export interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// Public API - No Authentication Required

export const getPublicCourses = async (
  page: number = 1,
  perPage: number = 6,
  category?: string,
  search?: string,
): Promise<PaginatedResponse<Course>> => {
  let url = `${API_BASE_URL}/courses?page=${page}&per_page=${perPage}`;

  if (category) {
    url += `&category=${encodeURIComponent(category)}`;
  }

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }

  return await response.json();
};

export const getFeaturedCourses = async (): Promise<Course[]> => {
  const response = await fetch(`${API_BASE_URL}/courses/featured`);

  if (!response.ok) {
    throw new Error('Failed to fetch featured courses');
  }

  return await response.json();
};

export const getPopularCourses = async (): Promise<Course[]> => {
  const response = await fetch(`${API_BASE_URL}/courses/popular`);

  if (!response.ok) {
    throw new Error('Failed to fetch popular courses');
  }

  return await response.json();
};

export const getLatestCourses = async (): Promise<Course[]> => {
  const response = await fetch(`${API_BASE_URL}/courses/latest`);

  if (!response.ok) {
    throw new Error('Failed to fetch latest courses');
  }

  return await response.json();
};

export const getPublicCourseBySlug = async (slug: string): Promise<Course> => {
  const response = await fetch(`${API_BASE_URL}/courses/${slug}`);

  if (!response.ok) {
    throw new Error('Failed to fetch course');
  }

  return await response.json();
};

// Protected API - Authentication Required

export const getCourses = async (
  page: number = 1,
  perPage: number = 10,
  instructor_id?: number,
): Promise<PaginatedCourseResponse> => {
  const token = getAuthToken();
  console.log('Fetching courses with token:', token);

  if (!token) {
    console.error('Authentication required but no token found');
    throw new Error('Authentication required');
  }
  
  let url = '';
  
  // Use the dedicated instructor-specific endpoint for related courses if instructor_id is provided
  if (instructor_id) {
    url = `${API_BASE_URL}/instructors/${instructor_id}/related-courses?page=${page}&per_page=${perPage}`;
  } else {
    url = `${API_BASE_URL}/courses?page=${page}&per_page=${perPage}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('Courses fetch failed with status:', response.status);
    if (response.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error('Failed to fetch courses');
  }

  try {
    const responseData = await response.json();
    console.log('Courses response structure:', Object.keys(responseData));
    console.log(
      'Response data sample:',
      JSON.stringify(responseData).substring(0, 300),
    );

    // Initialize a default response structure
    const defaultResponse: PaginatedCourseResponse = {
      data: [],
      current_page: page,
      total: 0,
      per_page: perPage,
      last_page: 1,
    };

    // Handle instructor related courses response format
    if (instructor_id && responseData.success && responseData.data && responseData.data.courses) {
      console.log(`Found ${responseData.data.courses.length} instructor related courses`);
      return {
        data: responseData.data.courses,
        current_page: page,
        total: responseData.data.courses.length,
        per_page: perPage,
        last_page: Math.ceil(responseData.data.courses.length / perPage),
      };
    }

    // Handle nested data structure (data.data.data) - Laravel paginated response format
    if (
      responseData.data &&
      typeof responseData.data === 'object' &&
      responseData.data.data &&
      Array.isArray(responseData.data.data)
    ) {
      console.log(
        `Found ${responseData.data.data.length} courses in nested paginated response`,
      );
      return {
        data: responseData.data.data,
        current_page: responseData.data.current_page || page,
        total: responseData.data.total || responseData.data.data.length,
        per_page: responseData.data.per_page || perPage,
        last_page:
          responseData.data.last_page ||
          Math.ceil(
            (responseData.data.total || responseData.data.data.length) /
              perPage,
          ),
        from: responseData.data.from,
        to: responseData.data.to,
        next_page_url: responseData.data.next_page_url,
        prev_page_url: responseData.data.prev_page_url,
      };
    }

    // Handle standard paginated response
    if (responseData.data && Array.isArray(responseData.data)) {
      console.log(
        `Found ${responseData.data.length} courses in paginated response`,
      );
      return {
        data: responseData.data,
        current_page: responseData.current_page || page,
        total: responseData.total || responseData.data.length,
        per_page: responseData.per_page || perPage,
        last_page:
          responseData.last_page ||
          Math.ceil((responseData.total || responseData.data.length) / perPage),
        from: responseData.from,
        to: responseData.to,
        next_page_url: responseData.next_page_url,
        prev_page_url: responseData.prev_page_url,
      };
    }

    // Handle direct array response (no pagination)
    if (Array.isArray(responseData)) {
      console.log(
        `Found ${responseData.length} courses in direct array response`,
      );
      return {
        data: responseData,
        current_page: 1,
        total: responseData.length,
        per_page: responseData.length,
        last_page: 1,
      };
    }

    // If none of the above, check if the whole response might be a single course
    if (responseData.id && responseData.title) {
      console.log('Response appears to be a single course');
      return {
        data: [responseData],
        current_page: 1,
        total: 1,
        per_page: 1,
        last_page: 1,
      };
    }

    console.error('Unexpected response structure:', responseData);
    return defaultResponse;
  } catch (error) {
    console.error('Error parsing courses response:', error);
    throw error;
  }
};

export const getCourseById = async (
  courseId: string | number,
): Promise<Course> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error('Failed to fetch course');
  }

  return await response.json();
};

export const createCourse = async (
  courseData: CourseCreateData,
): Promise<Course> => {
  const token = getAuthToken();
  console.log('Creating course with token:', token);

  if (!token) {
    console.error('Authentication required but no token found');
    throw new Error('Authentication required');
  }

  console.log('Course creation API URL:', `${API_BASE_URL}/courses`);
  console.log('Course data:', JSON.stringify(courseData, null, 2));

  try {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });

    console.log('Course creation status:', response.status);

    const responseData = await response.json();

    if (!response.ok) {
      console.error(
        'Course creation failed with status:',
        response.status,
        responseData,
      );

      if (response.status === 401) {
        throw new Error('Authentication required');
      }

      // Check if it's a validation error with structured error messages
      if (responseData.errors && typeof responseData.errors === 'object') {
        // Format validation errors into a readable message
        const errorMessages = Object.entries(responseData.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(', ')}`,
          )
          .join('; ');

        throw new Error(`Validation error: ${errorMessages}`);
      }

      throw new Error(
        `Failed to create course: ${responseData.message || 'Unknown error'}`,
      );
    }

    console.log('Course creation response:', responseData);
    return responseData;
  } catch (error) {
    console.error('Course creation exception:', error);
    throw error;
  }
};

export const updateCourse = async (
  courseId: string | number,
  courseData: Partial<CourseCreateData>,
): Promise<Course> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error(
        'Course update failed with status:',
        response.status,
        responseData,
      );

      if (response.status === 401) {
        throw new Error('Authentication required');
      }

      // Check if it's a validation error with structured error messages
      if (responseData.errors && typeof responseData.errors === 'object') {
        // Format validation errors into a readable message
        const errorMessages = Object.entries(responseData.errors)
          .map(
            ([field, messages]) =>
              `${field}: ${(messages as string[]).join(', ')}`,
          )
          .join('; ');

        throw new Error(`Validation error: ${errorMessages}`);
      }

      throw new Error(
        `Failed to update course: ${responseData.message || 'Unknown error'}`,
      );
    }

    return responseData;
  } catch (error) {
    console.error('Course update exception:', error);
    throw error;
  }
};

export const deleteCourse = async (
  courseId: string | number,
): Promise<{ message: string }> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error('Failed to delete course');
  }

  return await response.json();
};

export const getCourseVideos = async (
  courseId: string | number,
): Promise<CourseVideo[]> => {
  const token = getAuthToken();
  console.log(`Fetching videos for course ${courseId} with token:`, token);

  if (!token) {
    console.error('Authentication required but no token found');
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/videos`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('Course videos fetch failed with status:', response.status);
    if (response.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error('Failed to fetch course videos');
  }

  try {
    const data = await response.json();
    console.log('Course videos response structure:', Object.keys(data));

    // Handle paginated response
    if (data.data && Array.isArray(data.data)) {
      console.log(`Found ${data.data.length} videos in paginated response`);
      return data.data;
    }

    // Handle direct array response
    if (Array.isArray(data)) {
      console.log(`Found ${data.length} videos in direct array response`);
      return data;
    }

    console.error('Unexpected response structure:', data);
    return [];
  } catch (error) {
    console.error('Error parsing course videos response:', error);
    throw error;
  }
};

export const getCourseDiscussions = async (
  courseId: string | number,
): Promise<CourseDiscussion[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(
    `${API_BASE_URL}/courses/${courseId}/discussions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error('Failed to fetch course discussions');
  }

  return await response.json();
};

export const getCourseEnrollments = async (
  courseId: string | number,
): Promise<CourseEnrollment[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(
    `${API_BASE_URL}/courses/${courseId}/enrollments`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error('Failed to fetch course enrollments');
  }

  return await response.json();
};

export const enrollInCourse = async (
  courseId: string | number,
): Promise<{ message: string }> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error('Failed to enroll in course');
  }

  return await response.json();
};

// Course Videos Management (Instructor/Admin Only)

export const getAllCourseVideos = async (
  courseId?: string | number,
): Promise<CourseVideo[]> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  let url = `${API_BASE_URL}/course-videos`;
  if (courseId) {
    url += `?course_id=${courseId}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error('Failed to fetch course videos');
  }

  return await response.json();
};

export const getCourseVideoById = async (
  videoId: string | number,
): Promise<CourseVideo> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/course-videos/${videoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error('Failed to fetch course video');
  }

  return await response.json();
};

export const createCourseVideo = async (
  videoData: CourseVideoCreateData,
): Promise<CourseVideo> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/course-videos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(videoData),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error('Failed to create course video');
  }

  return await response.json();
};

export const updateCourseVideo = async (
  videoId: string | number,
  videoData: Partial<CourseVideoCreateData>,
): Promise<CourseVideo> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/course-videos/${videoId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(videoData),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error('Failed to update course video');
  }

  return await response.json();
};

export const deleteCourseVideo = async (
  videoId: string | number,
): Promise<{ message: string }> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/course-videos/${videoId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication required');
    }
    throw new Error('Failed to delete course video');
  }

  return await response.json();
};
