import { BaseService } from './base.service';
import api from './api';

export type EventType = 'webinar' | 'workshop' | 'conference' | 'other';

export interface EventSpeaker {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  title: string;
  company: string;
}

export interface EventSession {
  id: string;
  title: string;
  description: string;
  speaker: EventSpeaker;
  startTime: string;
  endTime: string;
  date: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnailUrl: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  location: string;
  address?: string;
  isVirtual: boolean;
  meetingLink?: string;
  type: EventType;
  price: number | 'Free';
  capacity: number;
  attendees: number;
  organizer: {
    name: string;
    logo: string;
    description: string;
  };
  speakers: EventSpeaker[];
  schedule: EventSession[];
}

export interface EventRegistration {
  id: number;
  user_id: number;
  event_id: number;
  attended: boolean;
  created_at: string;
  updated_at: string;
}

class EventService extends BaseService {
  // Public routes
  async getUpcomingEvents(): Promise<Event[]> {
    const response = await api.get<Event[]>('/events/upcoming');
    return response.data;
  }

  async getEvent(id: string): Promise<Event> {
    return this.get<Event>(`/events/${id}`);
  }

  async getEvents(): Promise<Event[]> {
    return this.get<Event[]>('/events');
  }

  // Protected routes
  async createEvent(data: Omit<Event, 'id'>): Promise<Event> {
    return this.post<Event>('/events', data);
  }

  async updateEvent(id: number, data: Partial<Event>): Promise<Event> {
    const response = await api.put<Event>(`/events/${id}`, data);
    return response.data;
  }

  async deleteEvent(id: number): Promise<void> {
    await api.delete(`/events/${id}`);
  }

  async getEventRegistrations(eventId: number): Promise<EventRegistration[]> {
    const response = await api.get<EventRegistration[]>(
      `/events/${eventId}/registrations`,
    );
    return response.data;
  }

  async registerForEvent(eventId: string): Promise<void> {
    return this.post(`/events/${eventId}/register`);
  }

  async markRegistrationAttended(
    registrationId: number,
  ): Promise<EventRegistration> {
    const response = await api.put<EventRegistration>(
      `/event-registrations/${registrationId}/attend`,
    );
    return response.data;
  }

  async cancelRegistration(registrationId: number): Promise<EventRegistration> {
    const response = await api.put<EventRegistration>(
      `/event-registrations/${registrationId}/cancel`,
    );
    return response.data;
  }
}

export const eventService = new EventService();
