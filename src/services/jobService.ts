import { getAuthToken } from '@/utils/auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Using the imported getAuthToken function from @/utils/auth

export interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  requirements: string;
  location: string;
  salary_range: string;
  job_type: string;
  work_location_type: string;
  experience_level: string;
  application_url: string;
  deadline: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface JobCreateData {
  title: string;
  company: string;
  description: string;
  requirements: string;
  location: string;
  salary_range: string;
  job_type: string;
  work_location_type: string;
  experience_level: string;
  application_url: string;
  deadline: string;
  status: string;
}

export const createJob = async (jobData: JobCreateData) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/job-opportunities`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobData),
  });

  const responseData = await response.json();

  if (!response.ok) {
    console.error(
      'Job creation failed with status:',
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
      `Failed to create job opportunity: ${responseData.message || 'Unknown error'}`,
    );
  }

  return responseData;
};

export const updateJob = async (
  jobId: string | number,
  jobData: Partial<JobCreateData>,
) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/job-opportunities/${jobId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobData),
  });

  const responseData = await response.json();

  if (!response.ok) {
    console.error(
      'Job update failed with status:',
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
      `Failed to update job opportunity: ${responseData.message || 'Unknown error'}`,
    );
  }

  return responseData;
};

export const deleteJob = async (jobId: string | number) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/job-opportunities/${jobId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete job opportunity');
  }

  return await response.json();
};

export const getJobs = async (
  page: number = 1,
): Promise<PaginatedResponse<Job>> => {
  try {
    // const token = getAuthToken();
    // if (!token) {
    //   throw new Error('Authentication required');
    // }

    const response = await fetch(
      `${API_BASE_URL}/job-opportunities/open?page=${page}`,
      {
        headers: {
          // Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch job opportunities');
    }

    const responseData = await response.json();

    if (!responseData.success) {
      throw new Error('API response indicates failure');
    }

    return responseData.data;
  } catch (error) {
    console.error('Error fetching job opportunities:', error);
    throw error;
  }
};

export const getJobById = async (jobId: string | number): Promise<Job> => {
  // const token = getAuthToken();
  // if (!token) {
  //   throw new Error('Authentication required');
  // }

  const response = await fetch(`${API_BASE_URL}/job-opportunities/${jobId}`, {
    headers: {
      // Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch job opportunity');
  }

  const data = await response.json();
  return data.data;
};
