import { getAuthToken } from '@/utils/auth';
import { MentorshipProgram, Mentor } from '@/types/mentorship';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export interface MentorshipProgramCreateData {
  title: string;
  description: string;
  mentor_id: number;
  duration: string;
  capacity: number;
  status: string;
  category?: string;
}

export const createMentorshipProgram = async (
  programData: MentorshipProgramCreateData,
) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/mentorship-programs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(programData),
  });

  const responseData = await response.json();

  if (!response.ok) {
    console.error(
      'Mentorship program creation failed with status:',
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
      `Failed to create mentorship program: ${responseData.message || 'Unknown error'}`,
    );
  }

  return responseData;
};

export const updateMentorshipProgram = async (
  programId: string | number,
  programData: Partial<MentorshipProgramCreateData>,
) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(
    `${API_BASE_URL}/mentorship-programs/${programId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(programData),
    },
  );

  const responseData = await response.json();

  if (!response.ok) {
    console.error(
      'Mentorship program update failed with status:',
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
      `Failed to update mentorship program: ${responseData.message || 'Unknown error'}`,
    );
  }

  return responseData;
};

export const deleteMentorshipProgram = async (programId: string | number) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(
    `${API_BASE_URL}/mentorship-programs/${programId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to delete mentorship program');
  }

  return await response.json();
};

export const getMentorshipPrograms = async (): Promise<MentorshipProgram[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/mentorship-programs/open`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch mentorship programs');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching mentorship programs:', error);
    throw error;
  }
};

export const getMentorshipProgramById = async (
  programId: string | number,
): Promise<MentorshipProgram> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(
    `${API_BASE_URL}/mentorship-programs/${programId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch mentorship program');
  }

  const data = await response.json();
  return data.data;
};

export const getMentors = async (): Promise<Mentor[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/mentors`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch mentors');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching mentors:', error);
    throw error;
  }
};
