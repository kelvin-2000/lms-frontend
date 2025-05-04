'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

// Types
type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

interface CourseVideo {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  isFree: boolean;
}

interface CourseInstructor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  title: string;
}

interface CourseDiscussion {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  content: string;
  date: string;
  replies: number;
}

interface CourseDetails {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  thumbnailUrl: string;
  level: CourseLevel;
  duration: string;
  totalVideos: number;
  price: number | 'Free';
  rating: number;
  ratingCount: number;
  studentsCount: number;
  lastUpdate: string;
  requirements: string[];
  whatYouWillLearn: string[];
  instructor: CourseInstructor;
  videos: CourseVideo[];
  discussions: CourseDiscussion[];
}

// This is mock data that would normally come from an API call to the Laravel backend
const mockCourseDetails: CourseDetails = {
  id: '1',
  title: 'Introduction to Web Development',
  description:
    'Learn the fundamentals of web development with HTML, CSS, and JavaScript.',
  longDescription:
    'This comprehensive course will guide you through the core technologies of web development. Starting with HTML and CSS, you will learn how to structure and style web pages. Then, you will dive into JavaScript to make your pages interactive. By the end of this course, you will have built several real-world projects and gained a solid foundation in web development.',
  thumbnailUrl: '/assets/courses/web-dev.jpg',
  level: 'beginner',
  duration: '8 weeks',
  totalVideos: 42,
  price: 49.99,
  rating: 4.7,
  ratingCount: 1283,
  studentsCount: 15420,
  lastUpdate: 'November 2023',
  requirements: [
    'No prior programming experience needed',
    'Basic computer skills',
    'A computer with internet connection',
    'Eagerness to learn and practice',
  ],
  whatYouWillLearn: [
    'Build responsive websites with HTML, CSS, and JavaScript',
    'Understand core web development concepts',
    'Create interactive user interfaces',
    'Implement basic form validation',
    'Deploy websites to the internet',
    'Work with popular development tools',
  ],
  instructor: {
    id: '101',
    name: 'John Doe',
    avatar: '/assets/instructors/avatar.jpg',
    title: 'Senior Web Developer at TechCorp',
    bio: 'John has been working as a web developer for over 10 years and has helped thousands of students learn web development. He specializes in frontend technologies and loves making complex concepts easy to understand.',
  },
  videos: [
    {
      id: 'v1',
      title: 'Introduction to the Course',
      duration: '10:15',
      videoUrl: '/assets/videos/intro.mp4',
      isFree: true,
    },
    {
      id: 'v2',
      title: 'HTML Basics - Document Structure',
      duration: '15:30',
      videoUrl: '/assets/videos/html-basics.mp4',
      isFree: true,
    },
    {
      id: 'v3',
      title: 'HTML Elements and Attributes',
      duration: '20:45',
      videoUrl: '/assets/videos/html-elements.mp4',
      isFree: false,
    },
    {
      id: 'v4',
      title: 'Introduction to CSS',
      duration: '18:20',
      videoUrl: '/assets/videos/css-intro.mp4',
      isFree: false,
    },
    {
      id: 'v5',
      title: 'CSS Selectors and Properties',
      duration: '22:10',
      videoUrl: '/assets/videos/css-selectors.mp4',
      isFree: false,
    },
  ],
  discussions: [
    {
      id: 'd1',
      userId: 'u1',
      userName: 'Sarah Johnson',
      userAvatar: '/assets/mentors/avatar.jpg',
      title: 'Question about CSS Flexbox',
      content:
        "I'm having trouble understanding how to center elements vertically with flexbox. Can someone please explain?",
      date: '2 days ago',
      replies: 3,
    },
    {
      id: 'd2',
      userId: 'u2',
      userName: 'Michael Brown',
      userAvatar: '/assets/mentors/avatar.jpg',
      title: 'JavaScript Function Scope',
      content:
        "Can someone explain the difference between let, const, and var in JavaScript? I'm confused about scope.",
      date: '1 week ago',
      replies: 5,
    },
  ],
};

export default function CourseDetailPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const course = mockCourseDetails;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About This Course
            </h2>
            <p className="text-gray-700 mb-6">{course.longDescription}</p>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                What You&apos;ll Learn
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.whatYouWillLearn.map((item, index) => (
                  <div key={index} className="flex">
                    <svg
                      className="w-6 h-6 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Requirements
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                {course.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'curriculum':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Course Curriculum
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-4">
                {course.videos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center">
                      <svg
                        className="w-6 h-6 text-indigo-600 mr-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {video.duration}
                        </p>
                      </div>
                    </div>
                    {video.isFree ? (
                      <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                        Free Preview
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                        Premium
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'instructor':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Instructor
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start">
                <div className="w-20 h-20 relative rounded-full overflow-hidden mr-4 flex-shrink-0">
                  <Image
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {course.instructor.name}
                  </h3>
                  <p className="text-gray-500 mb-2">
                    {course.instructor.title}
                  </p>
                  <p className="text-gray-700">{course.instructor.bio}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Student Reviews
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mr-4">
                  {course.rating}
                </div>
                <div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    {course.ratingCount} ratings
                  </p>
                </div>
              </div>
              {/* Add mock reviews here */}
            </div>
          </div>
        );
      case 'discussions':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Course Discussions
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="space-y-6">
                {course.discussions.map((discussion) => (
                  <div
                    key={discussion.id}
                    className="border-b border-gray-200 pb-6 last:border-b-0"
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 relative rounded-full overflow-hidden mr-4 flex-shrink-0">
                        <Image
                          src={discussion.userAvatar}
                          alt={discussion.userName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {discussion.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {discussion.userName} • {discussion.date}
                        </p>
                        <p className="text-gray-700 mb-2">
                          {discussion.content}
                        </p>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          {discussion.replies} replies
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero section with course info */}
      <div className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-2 text-sm mb-4">
                <Link href="/courses" className="hover:underline">
                  Courses
                </Link>
                <span>&gt;</span>
                <span>
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              <p className="text-indigo-100 text-lg mb-6">
                {course.description}
              </p>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2">
                    {course.rating.toFixed(1)} ({course.ratingCount} ratings)
                  </span>
                </div>
                <span>|</span>
                <div className="flex items-center">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span>{course.studentsCount.toLocaleString()} students</span>
                </div>
              </div>

              <div className="flex items-center mb-6">
                <div className="flex items-center mr-4">
                  <div className="w-10 h-10 relative rounded-full overflow-hidden mr-3">
                    <Image
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">
                      Instructor: {course.instructor.name}
                    </p>
                    <p className="text-sm text-indigo-100">
                      {course.instructor.title}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                  </svg>
                  <span>{course.totalVideos} videos</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  <span>
                    {course.level.charAt(0).toUpperCase() +
                      course.level.slice(1)}
                  </span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
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
                  <span>Last updated: {course.lastUpdate}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors">
                  Enroll Now{' '}
                  {course.price === 'Free'
                    ? '(Free)'
                    : `($${typeof course.price === 'number' ? course.price.toFixed(2) : course.price})`}
                </button>
                <button className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                  Add to Wishlist
                </button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={course.thumbnailUrl}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-indigo-600 hover:bg-gray-100 transition-colors">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Course content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`${
                    activeTab === 'overview'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`${
                    activeTab === 'curriculum'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Curriculum
                </button>
                <button
                  onClick={() => setActiveTab('instructor')}
                  className={`${
                    activeTab === 'instructor'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Instructor
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`${
                    activeTab === 'reviews'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Reviews
                </button>
                <button
                  onClick={() => setActiveTab('discussions')}
                  className={`${
                    activeTab === 'discussions'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Discussions
                </button>
              </nav>
            </div>

            {/* Tab content */}
            {renderTabContent()}
          </div>

          {/* Right column - Course curriculum */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Course Curriculum
              </h3>
              <div className="mb-4">
                <p className="text-gray-500">
                  {course.totalVideos} videos • {course.duration}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {course.videos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="mr-3 flex-shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900">
                          {video.title}
                        </h4>
                        <span className="text-gray-500 text-sm">
                          {video.duration}
                        </span>
                      </div>
                      {video.isFree && (
                        <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Free Preview
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors mb-4">
                Show All Content
              </button>

              <button className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                Enroll in Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
