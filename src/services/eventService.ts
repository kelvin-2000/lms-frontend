import { getAuthToken } from '@/utils/auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Using the imported getAuthToken function from @/utils/auth

export interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  max_participants: number;
  image_url: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventCreateData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  max_participants?: number;
  image_url?: string;
  type: string;
  status: string;
}

export const createEvent = async (eventData: EventCreateData) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });

  const responseData = await response.json();

  if (!response.ok) {
    console.error(
      'Event creation failed with status:',
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
      `Failed to create event: ${responseData.message || 'Unknown error'}`,
    );
  }

  return responseData;
};

export const updateEvent = async (
  eventId: string,
  eventData: Partial<EventCreateData>,
) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error('Failed to update event');
  }

  return await response.json();
};

export const deleteEvent = async (eventId: string) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete event');
  }

  return await response.json();
};

export const getEvents = async (): Promise<Event[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_BASE_URL}/events/upcoming`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const getEventById = async (eventId: string): Promise<Event> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch event');
  }

  const data = await response.json();
  return data.data;
};
