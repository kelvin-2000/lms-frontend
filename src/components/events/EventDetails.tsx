import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Event, EventType } from '@/types/events';
import { eventService } from '@/services/event.service';

interface EventDetailsProps {
  event: Event;
}

const EventDetails = ({ event }: EventDetailsProps) => {
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMMM d, yyyy • h:mm a');
  };

  const getEventTypeColor = (type: EventType) => {
    switch (type) {
      case 'webinar':
        return 'bg-blue-100 text-blue-800';
      case 'workshop':
        return 'bg-green-100 text-green-800';
      case 'conference':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRegister = async () => {
    try {
      await eventService.registerForEvent(event.id);
      // Show success message or redirect
    } catch (error) {
      // Handle error
      console.error('Failed to register for event:', error);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero section */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${getEventTypeColor(event.type)} capitalize`}
                >
                  {event.type}
                </span>
                {event.isVirtual && (
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">
                    Virtual
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6">{event.description}</p>

              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={event.organizer.logo}
                    alt={event.organizer.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {event.organizer.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{event.location}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {formatDate(event.startDate)}
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-700">{event.location}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {typeof event.price === 'number'
                      ? `$${event.price}`
                      : event.price}
                  </span>
                </div>
              </div>

              <button
                onClick={handleRegister}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Register Now
              </button>
            </div>

            <div className="relative h-80 lg:h-full rounded-lg overflow-hidden shadow-lg">
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2">
            {/* About the event */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Event
              </h2>
              <p className="text-gray-700 whitespace-pre-line">
                {event.longDescription}
              </p>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Schedule
              </h2>
              <div className="space-y-6">
                {event.schedule.map((session) => (
                  <div
                    key={session.id}
                    className="border-l-4 border-indigo-200 pl-4"
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                        <Image
                          src={session.speaker.avatar}
                          alt={session.speaker.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {session.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {session.speaker.name} • {session.speaker.title} at{' '}
                          {session.speaker.company}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(session.date)} • {session.startTime} -{' '}
                          {session.endTime}
                        </p>
                        <p className="text-gray-700 mt-2">
                          {session.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Speakers */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Speakers
              </h2>
              <div className="space-y-6">
                {event.speakers.map((speaker) => (
                  <div key={speaker.id} className="flex items-start">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={speaker.avatar}
                        alt={speaker.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {speaker.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {speaker.title} at {speaker.company}
                      </p>
                      <p className="text-gray-700 mt-2 text-sm">
                        {speaker.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Organizer */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Organizer
              </h2>
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={event.organizer.logo}
                    alt={event.organizer.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {event.organizer.name}
                  </h3>
                  <p className="text-gray-700 mt-2">
                    {event.organizer.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
