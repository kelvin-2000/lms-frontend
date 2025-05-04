'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { useState } from 'react';

// Types
type EventType = 'webinar' | 'workshop' | 'conference' | 'other';

interface EventSpeaker {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  title: string;
  isKeynote?: boolean;
  company: string;
  socialLinks?: { platform: string; url: string }[];
}

interface EventSession {
  id: string;
  title: string;
  description: string;
  speaker: EventSpeaker;
  startTime: string;
  endTime: string;
  date: string;
  isKeynote?: boolean;
}

interface EventDetails {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnailUrl: string;
  coverImage: string;
  startDate: Date;
  endDate: Date;
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
  attendeesList?: {
    id: string;
    name: string;
    avatar: string;
    company: string;
    role: string;
  }[];
}

// This is mock data that would normally come from an API call to the Laravel backend
const mockEventDetails: EventDetails = {
  id: '1',
  title: 'Web Development Trends 2023',
  description:
    'Join us for an insightful webinar on the latest trends in web development.',
  longDescription:
    "In this webinar, our expert speakers will discuss the most important web development trends of 2023. Learn about new frameworks, tools, and best practices that are shaping the industry. Whether you're a beginner or an experienced developer, you'll gain valuable insights that you can apply to your projects right away. We'll also have a Q&A session where you can ask our speakers your most pressing questions.",
  thumbnailUrl: '/assets/events/event.jpg',
  coverImage: '/assets/events/event.jpg',
  startDate: new Date('2023-12-15T18:00:00'),
  endDate: new Date('2023-12-15T20:00:00'),
  location: 'Online',
  isVirtual: true,
  meetingLink: 'https://zoom.us/j/1234567890',
  type: 'webinar',
  price: 'Free',
  capacity: 500,
  attendees: 312,
  organizer: {
    name: 'TechCorp Learning',
    logo: '/assets/organizers/techcorp.png',
    description:
      'TechCorp Learning is dedicated to providing high-quality tech education through webinars, workshops, and online courses.',
  },
  speakers: [
    {
      id: 's1',
      name: 'Jennifer Adams',
      avatar: '/assets/avatar.jpg',
      bio: 'Jennifer is a senior frontend developer with over 10 years of experience. She specializes in React and modern JavaScript frameworks.',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      socialLinks: [
        { platform: 'twitter', url: 'https://twitter.com/jennifer_adams' },
        {
          platform: 'linkedin',
          url: 'https://www.linkedin.com/in/jennifer-adams',
        },
      ],
    },
    {
      id: 's2',
      name: 'Michael Johnson',
      avatar: '/assets/avatar.jpg',
      bio: 'Michael is a full-stack developer and technical lead with expertise in scalable web applications and cloud infrastructure.',
      title: 'Technical Lead',
      company: 'WebSolutions Co.',
      socialLinks: [
        { platform: 'twitter', url: 'https://twitter.com/michael_johnson' },
        {
          platform: 'linkedin',
          url: 'https://www.linkedin.com/in/michael-johnson',
        },
      ],
    },
  ],
  schedule: [
    {
      id: 'ses1',
      title: 'Welcome and Introduction',
      description: 'Overview of the webinar and introduction to the speakers.',
      speaker: {
        id: 'org1',
        name: 'Sarah Williams',
        avatar: '/assets/avatar.jpg',
        bio: 'Sarah is the event coordinator at TechCorp Learning.',
        title: 'Event Coordinator',
        company: 'TechCorp Learning',
        isKeynote: true,
      },
      startTime: '18:00',
      endTime: '18:15',
      date: '2023-12-15',
    },
    {
      id: 'ses2',
      title: 'Frontend Development Trends',
      description:
        'Exploring the latest trends in frontend development, including frameworks, tools, and best practices.',
      speaker: {
        id: 's1',
        name: 'Jennifer Adams',
        avatar: '/assets/avatar.jpg',
        bio: 'Jennifer is a senior frontend developer with over 10 years of experience. She specializes in React and modern JavaScript frameworks.',
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        isKeynote: false,
      },
      startTime: '18:15',
      endTime: '18:45',
      date: '2023-12-15',
    },
    {
      id: 'ses3',
      title: 'Backend and Infrastructure Trends',
      description:
        'Discussing the evolution of backend technologies, cloud services, and DevOps practices.',
      speaker: {
        id: 's2',
        name: 'Michael Johnson',
        avatar: '/assets/avatar.jpg',
        bio: 'Michael is a full-stack developer and technical lead with expertise in scalable web applications and cloud infrastructure.',
        title: 'Technical Lead',
        company: 'WebSolutions Co.',
        isKeynote: false,
      },
      startTime: '18:45',
      endTime: '19:15',
      date: '2023-12-15',
    },
    {
      id: 'ses4',
      title: 'Q&A Session',
      description:
        'Interactive session where attendees can ask questions to the speakers.',
      speaker: {
        id: 'both',
        name: 'All Speakers',
        avatar: '/assets/avatar.jpg',
        bio: 'All the speakers will participate in the Q&A session.',
        title: 'Panel',
        company: 'Various',
        isKeynote: false,
      },
      startTime: '19:15',
      endTime: '19:45',
      date: '2023-12-15',
    },
    {
      id: 'ses5',
      title: 'Closing Remarks',
      description: 'Summary of key takeaways and closing of the webinar.',
      speaker: {
        id: 'org1',
        name: 'Sarah Williams',
        avatar: '/assets/avatar.jpg',
        bio: 'Sarah is the event coordinator at TechCorp Learning.',
        title: 'Event Coordinator',
        company: 'TechCorp Learning',
        isKeynote: true,
      },
      startTime: '19:45',
      endTime: '20:00',
      date: '2023-12-15',
    },
  ],
  attendeesList: [
    {
      id: 'a1',
      name: 'Alice Smith',
      avatar: '/assets/avatar.jpg',
      company: 'TechCorp',
      role: 'attendee',
    },
    {
      id: 'a2',
      name: 'Bob Johnson',
      avatar: '/assets/avatar.jpg',
      company: 'WebSolutions Co.',
      role: 'attendee',
    },
    {
      id: 'a3',
      name: 'Charlie Brown',
      avatar: '/assets/avatar.jpg',
      company: 'TechCorp',
      role: 'attendee',
    },
    {
      id: 'a4',
      name: 'Diana Miller',
      avatar: '/assets/avatar.jpg',
      company: 'WebSolutions Co.',
      role: 'attendee',
    },
  ],
};

export default function EventDetailPage() {
  const [activeTab, setActiveTab] = useState('about');
  const event = mockEventDetails;

  const formatDateRange = (startDate: Date, endDate: Date) => {
    const isSameDay = startDate.toDateString() === endDate.toDateString();

    if (isSameDay) {
      return `${format(startDate, 'MMMM d, yyyy')} • ${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`;
    } else {
      return `${format(startDate, 'MMMM d, yyyy')} - ${format(endDate, 'MMMM d, yyyy')}`;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About This Event
            </h2>
            <p className="text-gray-700 mb-6">{event.longDescription}</p>

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
                      {formatDateRange(event.startDate, event.endDate)}
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
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </p>
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
                <span className="font-medium">{event.schedule.length}</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {event.schedule.map((session, index) => (
                <div
                  key={session.id}
                  className={`p-6 ${index !== event.schedule.length - 1 ? 'border-b border-gray-200' : ''}`}
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
                              src={session.speaker.avatar}
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
                              {session.speaker.title}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                    {event.speakers.length}
                  </p>
                </div>
              </div>
            </div>
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
                          src={speaker.avatar}
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
                          {speaker.title}
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
                          {speaker.company}
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                      {speaker.bio}
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
                    {event.attendees}
                  </p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Register Now
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {event.attendeesList?.map((attendee) => (
                  <div key={attendee.id} className="flex items-center">
                    <div className="w-12 h-12 relative rounded-full overflow-hidden mr-4">
                      <Image
                        src={attendee.avatar}
                        alt={attendee.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {attendee.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {attendee.company}
                      </p>
                      <div className="flex items-center mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            attendee.role === 'speaker'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {attendee.role}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {event.attendees > (event?.attendeesList?.length || 0) && (
                <div className="mt-6 text-center">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                    View All {event.attendees} Attendees
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

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
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
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
                      <p>{formatDateRange(event.startDate, event.endDate)}</p>
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
                        {event.price === 'Free'
                          ? 'Free'
                          : `$${typeof event.price === 'number' ? event.price.toFixed(2) : event.price}`}
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

              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-indigo-600 overflow-hidden bg-gray-200"
                    >
                      <Image
                        src={`/assets/avatar.jpg`}
                        alt="Attendee"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-600 flex items-center justify-center bg-indigo-500 text-xs">
                    +{event.attendees - 5}
                  </div>
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
            </div>

            <div className="lg:w-1/3">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={event.thumbnailUrl}
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
                    {event.price === 'Free'
                      ? 'Free'
                      : `$${typeof event.price === 'number' ? event.price.toFixed(2) : event.price}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-700">Date</span>
                  <span className="font-medium text-gray-900">
                    {format(event.startDate, 'MMM d, yyyy')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-700">Time</span>
                  <span className="font-medium text-gray-900">
                    {format(event.startDate, 'h:mm a')} -{' '}
                    {format(event.endDate, 'h:mm a')}
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
