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
