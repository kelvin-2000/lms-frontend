import { useState, useEffect } from 'react';
import eventService, { Event } from '@/services/event.service';

export const useEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const events = await eventService.getUpcomingEvents();
        setUpcomingEvents(events);
      } catch (err) {
        setError('Failed to fetch events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return {
    upcomingEvents,
    loading,
    error,
  };
};
