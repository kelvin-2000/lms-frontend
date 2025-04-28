import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

// Types
type EventType = 'webinar' | 'workshop' | 'conference' | 'other';

interface EventSpeaker {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  title: string;
  company: string;
}

interface EventSession {
  id: string;
  title: string;
  description: string;
  speaker: EventSpeaker;
  startTime: string;
  endTime: string;
  date: string;
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
}

// This is mock data that would normally come from an API call to the Laravel backend
const mockEventDetails: EventDetails = {
  id: '1',
  title: 'Web Development Trends 2023',
  description: 'Join us for an insightful webinar on the latest trends in web development.',
  longDescription: 'In this webinar, our expert speakers will discuss the most important web development trends of 2023. Learn about new frameworks, tools, and best practices that are shaping the industry. Whether you\'re a beginner or an experienced developer, you\'ll gain valuable insights that you can apply to your projects right away. We\'ll also have a Q&A session where you can ask our speakers your most pressing questions.',
  thumbnailUrl: '/assets/events/webdev-trends.jpg',
  coverImage: '/assets/events/webdev-trends-cover.jpg',
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
    description: 'TechCorp Learning is dedicated to providing high-quality tech education through webinars, workshops, and online courses.',
  },
  speakers: [
    {
      id: 's1',
      name: 'Jennifer Adams',
      avatar: '/assets/speakers/jennifer.jpg',
      bio: 'Jennifer is a senior frontend developer with over 10 years of experience. She specializes in React and modern JavaScript frameworks.',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
    },
    {
      id: 's2',
      name: 'Michael Johnson',
      avatar: '/assets/speakers/michael.jpg',
      bio: 'Michael is a full-stack developer and technical lead with expertise in scalable web applications and cloud infrastructure.',
      title: 'Technical Lead',
      company: 'WebSolutions Co.',
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
        avatar: '/assets/speakers/sarah.jpg',
        bio: 'Sarah is the event coordinator at TechCorp Learning.',
        title: 'Event Coordinator',
        company: 'TechCorp Learning',
      },
      startTime: '18:00',
      endTime: '18:15',
      date: '2023-12-15',
    },
    {
      id: 'ses2',
      title: 'Frontend Development Trends',
      description: 'Exploring the latest trends in frontend development, including frameworks, tools, and best practices.',
      speaker: {
        id: 's1',
        name: 'Jennifer Adams',
        avatar: '/assets/speakers/jennifer.jpg',
        bio: 'Jennifer is a senior frontend developer with over 10 years of experience. She specializes in React and modern JavaScript frameworks.',
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
      },
      startTime: '18:15',
      endTime: '18:45',
      date: '2023-12-15',
    },
    {
      id: 'ses3',
      title: 'Backend and Infrastructure Trends',
      description: 'Discussing the evolution of backend technologies, cloud services, and DevOps practices.',
      speaker: {
        id: 's2',
        name: 'Michael Johnson',
        avatar: '/assets/speakers/michael.jpg',
        bio: 'Michael is a full-stack developer and technical lead with expertise in scalable web applications and cloud infrastructure.',
        title: 'Technical Lead',
        company: 'WebSolutions Co.',
      },
      startTime: '18:45',
      endTime: '19:15',
      date: '2023-12-15',
    },
    {
      id: 'ses4',
      title: 'Q&A Session',
      description: 'Interactive session where attendees can ask questions to the speakers.',
      speaker: {
        id: 'both',
        name: 'All Speakers',
        avatar: '/assets/speakers/group.jpg',
        bio: 'All the speakers will participate in the Q&A session.',
        title: 'Panel',
        company: 'Various',
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
        avatar: '/assets/speakers/sarah.jpg',
        bio: 'Sarah is the event coordinator at TechCorp Learning.',
        title: 'Event Coordinator',
        company: 'TechCorp Learning',
      },
      startTime: '19:45',
      endTime: '20:00',
      date: '2023-12-15',
    },
  ],
};

export default function EventDetailPage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch the event data using the ID from params
  const event = mockEventDetails;
  
  const formatDateRange = (startDate: Date, endDate: Date) => {
    const isSameDay = startDate.toDateString() === endDate.toDateString();
    
    if (isSameDay) {
      return `${format(startDate, 'MMMM d, yyyy')} • ${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`;
    } else {
      return `${format(startDate, 'MMMM d, yyyy')} - ${format(endDate, 'MMMM d, yyyy')}`;
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
                <span>{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">{event.title}</h1>
              <p className="text-indigo-100 text-lg mb-6">{event.description}</p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6 shadow-lg">
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-indigo-300 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h3 className="font-medium mb-1">Date & Time</h3>
                      <p>{formatDateRange(event.startDate, event.endDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-indigo-300 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <h3 className="font-medium mb-1">Location</h3>
                      <p>{event.location}</p>
                      {event.address && <p className="text-sm">{event.address}</p>}
                      {event.isVirtual && <p className="text-sm">Virtual Event</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-indigo-300 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-medium mb-1">Price</h3>
                      <p>{event.price === 'Free' ? 'Free' : `$${typeof event.price === 'number' ? event.price.toFixed(2) : event.price}`}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium">{event.attendees}</span> attending out of <span className="font-medium">{event.capacity}</span> spots
                    <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                      <div 
                        className="bg-white h-2 rounded-full" 
                        style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
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
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-600 overflow-hidden bg-gray-200">
                      <Image
                        src={`/assets/avatars/avatar-${i+1}.jpg`}
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
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    Share
                  </button>
                  <button className="flex items-center text-sm">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                <a className="border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                  About
                </a>
                <a className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                  Schedule
                </a>
                <a className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                  Speakers
                </a>
                <a className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                  Attendees
                </a>
              </nav>
            </div>
            
            {/* Event description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-700 mb-6">{event.longDescription}</p>
            </div>
            
            {/* Schedule */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Event Schedule</h3>
              <div className="space-y-6">
                {event.schedule.map((session, index) => (
                  <div key={session.id} className={`flex ${index !== event.schedule.length - 1 ? 'pb-6 border-b border-gray-200' : ''}`}>
                    <div className="w-24 flex-shrink-0">
                      <p className="font-medium text-gray-900">{session.startTime}</p>
                      <p className="text-gray-500 text-sm">{session.endTime}</p>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{session.title}</h4>
                          <p className="text-gray-700 mt-1">{session.description}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <div className="flex items-center">
                            <div className="w-10 h-10 relative rounded-full overflow-hidden mr-3">
                              <Image
                                src={session.speaker.avatar}
                                alt={session.speaker.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{session.speaker.name}</p>
                              <p className="text-xs text-gray-500">{session.speaker.title}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Speakers */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Speakers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.speakers.map(speaker => (
                  <div key={speaker.id} className="flex items-start">
                    <div className="w-16 h-16 relative rounded-full overflow-hidden mr-4 flex-shrink-0">
                      <Image
                        src={speaker.avatar}
                        alt={speaker.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{speaker.name}</h4>
                      <p className="text-sm text-gray-500 mb-2">{speaker.title} at {speaker.company}</p>
                      <p className="text-gray-700 text-sm">{speaker.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Organizer */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Organizer</h3>
              <div className="flex items-start">
                <div className="w-16 h-16 relative rounded-lg overflow-hidden mr-4 flex-shrink-0">
                  <Image
                    src={event.organizer.logo}
                    alt={event.organizer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{event.organizer.name}</h4>
                  <p className="text-gray-700 mt-1">{event.organizer.description}</p>
                  <button className="mt-3 text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center">
                    View profile
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Registration */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Register for this Event</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-700">Price</span>
                  <span className="font-medium text-gray-900">{event.price === 'Free' ? 'Free' : `$${typeof event.price === 'number' ? event.price.toFixed(2) : event.price}`}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Date</span>
                  <span className="font-medium text-gray-900">{format(event.startDate, 'MMM d, yyyy')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Time</span>
                  <span className="font-medium text-gray-900">{format(event.startDate, 'h:mm a')} - {format(event.endDate, 'h:mm a')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Location</span>
                  <span className="font-medium text-gray-900">{event.location}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-700">Available spots</span>
                  <span className="font-medium text-gray-900">{event.capacity - event.attendees}</span>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                <button className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors mb-3">
                  Register Now
                </button>
                
                {event.isVirtual && (
                  <div className="text-sm text-gray-600 text-center">
                    <p>Meeting link will be sent to your email after registration.</p>
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