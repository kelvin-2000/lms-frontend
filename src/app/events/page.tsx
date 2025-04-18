import EventCard from '@/components/events/EventCard';

// Define types for our mock data
type EventType = 'webinar' | 'workshop' | 'conference' | 'other';

interface MockEvent {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  startDate: Date;
  endDate: Date;
  location: string;
  type: EventType;
}

// This would normally come from an API call to the Laravel backend
const mockEvents: MockEvent[] = [
  {
    id: '1',
    title: 'Web Development Trends 2023',
    description: 'Join us for an insightful webinar on the latest trends in web development. Learn about new frameworks, tools, and best practices.',
    thumbnailUrl: '/assets/events/webdev-trends.jpg',
    startDate: new Date('2023-12-15T18:00:00'),
    endDate: new Date('2023-12-15T20:00:00'),
    location: 'Online',
    type: 'webinar',
  },
  {
    id: '2',
    title: 'Hands-on React Workshop',
    description: 'A practical workshop where you will build a complete React application from scratch. Perfect for intermediate developers looking to level up.',
    thumbnailUrl: '/assets/events/react-workshop.jpg',
    startDate: new Date('2023-12-20T09:00:00'),
    endDate: new Date('2023-12-21T17:00:00'),
    location: 'Tech Hub, San Francisco',
    type: 'workshop',
  },
  {
    id: '3',
    title: 'Laravel Conference 2023',
    description: 'The biggest Laravel event of the year featuring speakers from the core team and community. Networking opportunities and hands-on sessions.',
    thumbnailUrl: '/assets/events/laravel-conf.jpg',
    startDate: new Date('2024-01-10T08:00:00'),
    endDate: new Date('2024-01-12T18:00:00'),
    location: 'Convention Center, New York',
    type: 'conference',
  },
  {
    id: '4',
    title: 'UI/UX Design Masterclass',
    description: 'Learn the principles of effective UI/UX design and how to create user-centered interfaces that convert and engage.',
    thumbnailUrl: '/assets/events/uiux-masterclass.jpg',
    startDate: new Date('2024-01-25T14:00:00'),
    endDate: new Date('2024-01-25T17:00:00'),
    location: 'Online',
    type: 'webinar',
  },
];

export default function EventsPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Upcoming Events</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Join our webinars, workshops, and conferences to expand your knowledge and network with fellow professionals.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">All Event Types</option>
                <option value="webinar">Webinars</option>
                <option value="workshop">Workshops</option>
                <option value="conference">Conferences</option>
                <option value="other">Other</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">All Locations</option>
                <option value="online">Online</option>
                <option value="in-person">In-Person</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Any Date</option>
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="next-month">Next Month</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockEvents.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>

        {/* Calendar View Toggle */}
        <div className="mt-12 text-center">
          <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            Switch to Calendar View
          </button>
        </div>
      </div>
    </div>
  );
} 