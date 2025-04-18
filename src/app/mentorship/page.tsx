import MentorshipCard from '@/components/mentorship/MentorshipCard';

// Define types for our mock data
type MentorshipStatus = 'open' | 'closed' | 'completed';

interface MockMentorship {
  id: string;
  title: string;
  description: string;
  mentorName: string;
  mentorAvatar: string;
  mentorTitle: string;
  duration: string;
  capacity: number;
  status: MentorshipStatus;
}

// This would normally come from an API call to the Laravel backend
const mockMentorships: MockMentorship[] = [
  {
    id: '1',
    title: 'Frontend Development Career Guidance',
    description:
      'Get personalized guidance on building a successful career in frontend development. Topics include portfolio building, interview preparation, and skill development.',
    mentorName: 'Jennifer Adams',
    mentorAvatar: '/assets/mentors/jennifer.jpg',
    mentorTitle: 'Senior Frontend Developer at TechCorp',
    duration: '3 months',
    capacity: 5,
    status: 'open',
  },
  {
    id: '2',
    title: 'Backend Development with Laravel',
    description:
      'Enhance your Laravel skills with hands-on mentorship focused on best practices, architecture patterns, and advanced features.',
    mentorName: 'Michael Johnson',
    mentorAvatar: '/assets/mentors/michael.jpg',
    mentorTitle: 'Lead Laravel Developer at WebSolutions',
    duration: '4 months',
    capacity: 3,
    status: 'open',
  },
  {
    id: '3',
    title: 'UI/UX Design Principles',
    description:
      'Learn the fundamentals of effective UI/UX design through real-world projects and feedback sessions.',
    mentorName: 'Sarah Williams',
    mentorAvatar: '/assets/mentors/sarah.jpg',
    mentorTitle: 'Senior Designer at Creative Studio',
    duration: '2 months',
    capacity: 8,
    status: 'closed',
  },
  {
    id: '4',
    title: 'Full-Stack Web Development',
    description:
      'Comprehensive mentorship covering both frontend and backend development, with focus on building complete web applications.',
    mentorName: 'David Chen',
    mentorAvatar: '/assets/mentors/david.jpg',
    mentorTitle: 'CTO at TechStartup',
    duration: '6 months',
    capacity: 4,
    status: 'open',
  },
  {
    id: '5',
    title: 'Mobile App Development',
    description:
      'Guidance on building mobile applications with React Native or Flutter, including deployment and app store optimization.',
    mentorName: 'Emily Rogers',
    mentorAvatar: '/assets/mentors/emily.jpg',
    mentorTitle: 'Mobile Development Lead at AppWorks',
    duration: '4 months',
    capacity: 6,
    status: 'open',
  },
  {
    id: '6',
    title: 'Career Transition to Tech',
    description:
      'Support for professionals transitioning to tech careers from other fields, with focus on leveraging transferable skills.',
    mentorName: 'Robert Miller',
    mentorAvatar: '/assets/mentors/robert.jpg',
    mentorTitle: 'Engineering Manager & Career Coach',
    duration: '3 months',
    capacity: 10,
    status: 'completed',
  },
];

export default function MentorshipPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Mentorship Programs
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Connect with experienced mentors who can guide you on your learning
            journey and help you achieve your career goals.
          </p>
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How Mentorship Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Apply</h3>
              <p className="text-gray-600">
                Browse through available mentorship programs and apply to the
                ones that match your goals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Match</h3>
              <p className="text-gray-600">
                If selected, you'll be matched with your mentor and receive a
                program schedule.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Grow</h3>
              <p className="text-gray-600">
                Attend regular sessions, complete assignments, and receive
                personalized guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">All Categories</option>
                <option value="frontend">Frontend Development</option>
                <option value="backend">Backend Development</option>
                <option value="fullstack">Full-Stack Development</option>
                <option value="mobile">Mobile Development</option>
                <option value="design">UI/UX Design</option>
                <option value="career">Career Guidance</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="completed">Completed</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Duration</option>
                <option value="short">1-2 Months</option>
                <option value="medium">3-4 Months</option>
                <option value="long">5+ Months</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search mentorships..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Mentorships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockMentorships.map((mentorship) => (
            <MentorshipCard key={mentorship.id} {...mentorship} />
          ))}
        </div>

        {/* Become a Mentor CTA */}
        <div className="mt-16 bg-indigo-600 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Want to Share Your Knowledge?
          </h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            If you're an experienced professional looking to give back to the
            community, consider becoming a mentor.
          </p>
          <a
            href="/mentorship/apply"
            className="inline-block px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Apply to Become a Mentor
          </a>
        </div>
      </div>
    </div>
  );
}
