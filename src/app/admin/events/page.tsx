'use client';
import React from 'react';
import EventManagement from '@/components/events/EventManagement';
import { getEvents } from '@/services/eventService';

const EventsPage = async () => {
  const events = await getEvents();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Events</h1>
      <EventManagement
        events={events}
        onEventsUpdated={() => window.location.reload()}
      />
    </div>
  );
};

export default EventsPage;
