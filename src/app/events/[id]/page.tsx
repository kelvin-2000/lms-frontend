'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Types
type EventType = 'webinar' | 'workshop' | 'conference' | 'other';
type EventStatus = 'upcoming' | 'ongoing' | 'past' | 'canceled';

interface EventSpeaker {
  id: number;
  name: string;
  avatar: string | null;
  bio: string | null;
  title: string | null;
  isKeynote?: boolean;
  company: string | null;
  socialLinks?: { platform: string; url: string }[];
}

interface EventSession {
  id: number;
  title: string;
  description: string;
  speaker: EventSpeaker;
  startTime: string;
  endTime: string;
  date: string;
  isKeynote?: boolean;
}

interface EventDetails {
  id: number;
  title: string;
  description: string;
  longDescription?: string;
  thumbnailUrl?: string;
  coverImage?: string;
  date: string;
  time: string;
  location: string;
  address?: string;
  isVirtual?: boolean;
  meetingLink?: string;
  type?: EventType;
  registration_fee: number | string;
  capacity: number;
  attendees: number;
  status: EventStatus;
  organizer: string;
  created_at: string;
  updated_at: string;
  speakers?: EventSpeaker[];
  schedule?: EventSession[];
  registrations?: EventRegistration[];
}

interface EventUser {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
}

interface EventRegistration {
  id: number;
  event_id: number;
  user_id: number;
  status: string;
  attended: boolean;
  payment_status: string;
  created_at: string;
  updated_at: string;
  user: EventUser;
}

export default function EventDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('about');
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch event data');
        }

        const data = await response.json();

        if (data.success) {
          // Transform API response to match our interface
          setEvent({
            ...data.data,
            attendees: 0, // Will be updated when registrations are loaded
            // Convert registration_fee if it's a string to ensure it displays properly
            registration_fee:
              typeof data.data.registration_fee === 'string'
                ? parseFloat(data.data.registration_fee)
                : data.data.registration_fee,
          });

          // Fetch registrations if user is authenticated
          if (user) {
            try {
              const registrationsResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/events/${id}/registrations`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                },
              );

              if (registrationsResponse.ok) {
                const registrationsData = await registrationsResponse.json();
                if (registrationsData.success) {
                  setRegistrations(registrationsData.data);

                  // Update attendees count
                  setEvent((prevEvent) => {
                    if (!prevEvent) return null;
                    return {
                      ...prevEvent,
                      attendees: registrationsData.data.length,
                    };
                  });
                }
              }
            } catch (err) {
              console.error('Error fetching event registrations:', err);
              // We don't set the main error state here to allow the page to still render
            }
          }
        } else {
          setError('Failed to load event details');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(
          'An error occurred while fetching the event. Please try again later.',
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventData();
    }
  }, [id, user]);

  // Format date and time for display
  const formatDateAndTime = (dateStr: string, timeStr: string) => {
    try {
      // Parse the date (e.g., "2025-06-15")
      const date = parseISO(dateStr);

      // Extract start and end time from format like "10:00 AM - 4:00 PM"
      const [startTime, endTime] = timeStr.split(' - ');

      return {
        formattedDate: format(date, 'MMMM d, yyyy'),
        startTime,
        endTime,
        fullDisplay: `${format(date, 'MMMM d, yyyy')} • ${timeStr}`,
      };
    } catch (error) {
      console.error('Error formatting date and time:', error);
      return {
        formattedDate: dateStr || '',
        startTime: (timeStr && timeStr.split(' - ')[0]) || '',
        endTime: (timeStr && timeStr.split(' - ')[1]) || '',
        fullDisplay: `${dateStr || ''} • ${timeStr || ''}`,
      };
    }
  };

  // Default thumbnail image when none is provided
  const DEFAULT_THUMBNAIL = '/assets/events/default-event.jpg';
  const DEFAULT_AVATAR = '/assets/default-avatar.jpg';

  const renderTabContent = () => {
    if (!event) return null;

    switch (activeTab) {
      case 'about':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About This Event
            </h2>
            <p className="text-gray-700 mb-6">
              {event.longDescription || event.description}
            </p>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Event Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-indigo-600 mr-4 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Date & Time</p>
                    <p className="text-gray-600">
                      {formatDateAndTime(event.date, event.time).fullDisplay}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-indigo-600 mr-4 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
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
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                    {event.address && (
                      <p className="text-sm">{event.address}</p>
                    )}
                    {event.isVirtual && (
                      <p className="text-sm">Virtual Event</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-indigo-600 mr-4 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Event Type</p>
                    <p className="text-gray-600">
                      {event.type
                        ? event.type.charAt(0).toUpperCase() +
                          event.type.slice(1)
                        : 'Event'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-indigo-600 mr-4 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Capacity</p>
                    <p className="text-gray-600">{event.capacity} attendees</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-indigo-600 mr-4 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Organizer</p>
                    <p className="text-gray-600">{event.organizer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'schedule':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Event Schedule
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Total Sessions:</span>
                <span className="font-medium">
                  {event.schedule?.length || 0}
                </span>
              </div>
            </div>
            {event.schedule && event.schedule.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {event.schedule.map((session, index) => (
                  <div
                    key={session.id}
                    className={`p-6 ${index !== event.schedule!.length - 1 ? 'border-b border-gray-200' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="w-24 flex-shrink-0">
                        <div className="text-sm font-medium text-indigo-600">
                          {session.startTime}
                        </div>
                        <div className="text-xs text-gray-500">
                          {session.endTime}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {session.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {session.description}
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                session.isKeynote
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {session.isKeynote ? 'Keynote' : 'Session'}
                            </span>
                          </div>
                        </div>
                        {session.speaker && (
                          <div className="mt-4 flex items-center">
                            <div className="w-10 h-10 relative rounded-full overflow-hidden mr-3">
                              <Image
                                src={session.speaker.avatar || DEFAULT_AVATAR}
                                alt={session.speaker.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {session.speaker.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {session.speaker.title || 'Speaker'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">
                  No schedule information is available for this event yet.
                </p>
              </div>
            )}
          </div>
        );
      case 'speakers':
        return (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Featured Speakers
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Meet our industry experts and thought leaders
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Speakers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {event.speakers?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            {event.speakers && event.speakers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {event.speakers.map((speaker) => (
                  <div
                    key={speaker.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-24 h-24 relative rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={speaker.avatar || DEFAULT_AVATAR}
                            alt={speaker.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {speaker.name}
                          </h3>
                          <p className="text-sm text-indigo-600 font-medium">
                            {speaker.title || 'Speaker'}
                          </p>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <svg
                              className="w-4 h-4 mr-1.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                            {speaker.company || 'Independent'}
                          </div>
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                        {speaker.bio || 'Bio not available'}
                      </p>
                      <div className="mt-4 flex items-center space-x-3">
                        {speaker.socialLinks?.map((link) => (
                          <a
                            key={link.platform}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                          >
                            {link.platform === 'twitter' && (
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                              </svg>
                            )}
                            {link.platform === 'linkedin' && (
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                              </svg>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-500">
                  No speaker information is available for this event yet.
                </p>
              </div>
            )}
          </div>
        );
      case 'attendees':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Attendees</h2>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Attendees</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {registrations.length}
                  </p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Register Now
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              {registrations.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {registrations.map((registration) => (
                    <div key={registration.id} className="flex items-center">
                      <div className="w-12 h-12 relative rounded-full overflow-hidden mr-4">
                        <Image
                          src={registration.user.avatar || DEFAULT_AVATAR}
                          alt={registration.user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {registration.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {registration.user.email}
                        </p>
                        <div className="flex items-center mt-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              registration.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {registration.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No one has registered for this event yet. Be the first to
                    register!
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {error || 'Event not found'}
        </h2>
        <p className="text-gray-600 mb-8">
          We couldn&apos;t load the event details. Please try again later.
        </p>
        <Link
          href="/events"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg"
        >
          Browse Events
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero section with event info */}
      <div className="bg-indigo-600 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-900 opacity-90 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="lg:w-2/3">
              <div className="flex items-center space-x-2 text-sm mb-4">
                <Link href="/events" className="hover:underline">
                  Events
                </Link>
                <span>&gt;</span>
                <span>
                  {event.type
                    ? event.type.charAt(0).toUpperCase() + event.type.slice(1)
                    : 'Event'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                {event.title}
              </h1>
              <p className="text-indigo-100 text-lg mb-6">
                {event.description}
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6 shadow-lg">
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-indigo-300 mr-3 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <h3 className="font-medium mb-1">Date & Time</h3>
                      <p>
                        {formatDateAndTime(event.date, event.time).fullDisplay}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-indigo-300 mr-3 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
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
                    <div>
                      <h3 className="font-medium mb-1">Location</h3>
                      <p>{event.location}</p>
                      {event.address && (
                        <p className="text-sm">{event.address}</p>
                      )}
                      {event.isVirtual && (
                        <p className="text-sm">Virtual Event</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-indigo-300 mr-3 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h3 className="font-medium mb-1">Price</h3>
                      <p>
                        {event.registration_fee === 0 ||
                        event.registration_fee === '0' ||
                        event.registration_fee === '0.00'
                          ? 'Free'
                          : `$${
                              typeof event.registration_fee === 'number'
                                ? event.registration_fee.toFixed(2)
                                : parseFloat(event.registration_fee).toFixed(2)
                            }`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium">{event.attendees}</span>{' '}
                    attending out of{' '}
                    <span className="font-medium">{event.capacity}</span> spots
                    <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                      <div
                        className="bg-white h-2 rounded-full"
                        style={{
                          width: `${(event.attendees / event.capacity) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <button className="px-6 py-2 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors">
                    Register Now
                  </button>
                </div>
              </div>

              {registrations.length > 0 && (
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex -space-x-2">
                    {registrations.slice(0, 5).map((registration) => (
                      <div
                        key={registration.id}
                        className="w-8 h-8 rounded-full border-2 border-indigo-600 overflow-hidden bg-gray-200"
                      >
                        <Image
                          src={registration.user.avatar || DEFAULT_AVATAR}
                          alt={registration.user.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {registrations.length > 5 && (
                      <div className="w-8 h-8 rounded-full border-2 border-indigo-600 flex items-center justify-center bg-indigo-500 text-xs">
                        +{registrations.length - 5}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="flex items-center text-sm">
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      Share
                    </button>
                    <button className="flex items-center text-sm">
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Add to Calendar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:w-1/3">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={event.thumbnailUrl || DEFAULT_THUMBNAIL}
                  alt={event.title}
                  width={400}
                  height={225}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Event content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`${
                    activeTab === 'about'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  About
                </button>
                {event.schedule && event.schedule.length > 0 && (
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className={`${
                      activeTab === 'schedule'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Schedule
                  </button>
                )}
                {event.speakers && event.speakers.length > 0 && (
                  <button
                    onClick={() => setActiveTab('speakers')}
                    className={`${
                      activeTab === 'speakers'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Speakers
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('attendees')}
                  className={`${
                    activeTab === 'attendees'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Attendees
                </button>
              </nav>
            </div>

            {/* Tab content */}
            {renderTabContent()}
          </div>

          {/* Right column - Registration */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Register for this Event
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-700">Price</span>
                  <span className="font-medium text-gray-900">
                    {event.registration_fee === 0 ||
                    event.registration_fee === '0' ||
                    event.registration_fee === '0.00'
                      ? 'Free'
                      : `$${
                          typeof event.registration_fee === 'number'
                            ? event.registration_fee.toFixed(2)
                            : parseFloat(event.registration_fee).toFixed(2)
                        }`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-700">Date</span>
                  <span className="font-medium text-gray-900">
                    {formatDateAndTime(event.date, event.time).formattedDate}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-700">Time</span>
                  <span className="font-medium text-gray-900">
                    {event.time}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-700">Location</span>
                  <span className="font-medium text-gray-900">
                    {event.location}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-700">Available spots</span>
                  <span className="font-medium text-gray-900">
                    {event.capacity - event.attendees}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors mb-3">
                  Register Now
                </button>

                {event.isVirtual && (
                  <div className="text-sm text-gray-600 text-center">
                    <p>
                      Meeting link will be sent to your email after
                      registration.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
