import axios from 'axios';
import { Event } from '@/types/events';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createEvent = async (eventData: Omit<Event, 'id'>) => {
  const response = await axios.post(`${API_URL}/events`, eventData, {
    withCredentials: true,
  });
  return response.data;
};

export const updateEvent = async (
  eventId: string,
  eventData: Partial<Event>,
) => {
  const response = await axios.put(`${API_URL}/events/${eventId}`, eventData, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteEvent = async (eventId: string) => {
  const response = await axios.delete(`${API_URL}/events/${eventId}`, {
    withCredentials: true,
  });
  return response.data;
};

export const getEvents = async () => {
  const response = await axios.get(`${API_URL}/events`, {
    withCredentials: true,
  });
  return response.data;
};

export const getEventById = async (eventId: string) => {
  const response = await axios.get(`${API_URL}/events/${eventId}`, {
    withCredentials: true,
  });
  return response.data;
};
