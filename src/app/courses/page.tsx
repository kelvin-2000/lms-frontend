import CourseCard from '@/components/courses/CourseCard';

// Define types for our mock data to match CourseCardProps
type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
type CoursePrice = number | 'Free';

interface MockCourse {
  id: string;
  title: string;
  instructor: string;
  thumbnailUrl: string;
  level: CourseLevel;
  duration: string;
  price: CoursePrice;
}

// This would normally come from an API call to the Laravel backend
const mockCourses: MockCourse[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    instructor: 'John Doe',
    thumbnailUrl: '/assets/courses/web-dev.jpg',
    level: 'beginner',
    duration: '8 weeks',
    price: 49.99,
  },
  {
    id: '2',
    title: 'Advanced React Patterns',
    instructor: 'Jane Smith',
    thumbnailUrl: '/assets/courses/react.jpg',
    level: 'intermediate',
    duration: '6 weeks',
    price: 69.99,
  },
  {
    id: '3',
    title: 'Laravel API Development',
    instructor: 'Mike Johnson',
    thumbnailUrl: '/assets/courses/laravel.jpg',
    level: 'advanced',
    duration: '10 weeks',
    price: 79.99,
  },
  {
    id: '4',
    title: 'UI/UX Design Fundamentals',
    instructor: 'Sarah Williams',
    thumbnailUrl: '/assets/courses/ui-ux.jpg',
    level: 'beginner',
    duration: '5 weeks',
    price: 'Free',
  },
  {
    id: '5',
    title: 'Database Design & MySQL',
    instructor: 'Robert Chen',
    thumbnailUrl: '/assets/courses/database.jpg',
    level: 'intermediate',
    duration: '7 weeks',
    price: 59.99,
  },
  {
    id: '6',
    title: 'Mobile App Development with Flutter',
    instructor: 'Emily Davis',
    thumbnailUrl: '/assets/courses/flutter.jpg',
    level: 'intermediate',
    duration: '9 weeks',
    price: 69.99,
  },
];

export default function CoursesPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Explore Our Courses
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Discover a wide range of courses taught by industry experts and
            advance your skills in various domains.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">All Categories</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="design">Design</option>
                <option value="database">Database</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Price Range</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
                <option value="under-50">Under $50</option>
                <option value="50-100">$50 - $100</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
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

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <a
              href="#"
              className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Previous
            </a>
            <a
              href="#"
              className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-indigo-600 hover:bg-gray-50"
            >
              1
            </a>
            <a
              href="#"
              className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              2
            </a>
            <a
              href="#"
              className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              3
            </a>
            <a
              href="#"
              className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Next
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
