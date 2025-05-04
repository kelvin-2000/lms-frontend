import Link from 'next/link';
import Image from 'next/image';

// Types
type MentorExperience = {
  company: string;
  role: string;
  duration: string;
  description?: string;
};

type MentorEducation = {
  institution: string;
  degree: string;
  field: string;
  year: string;
};

type MentorshipType = 'one-on-one' | 'group' | 'workshop' | 'career-coaching';

type MentorshipProgram = {
  id: string;
  title: string;
  mentorName: string;
  mentorTitle: string;
  mentorCompany: string;
  mentorAvatar: string;
  mentorBio: string;
  mentorExperience: MentorExperience[];
  mentorEducation: MentorEducation[];
  mentorSkills: string[];
  mentorAchievements: string[];
  overview: string;
  description: string;
  type: MentorshipType;
  duration: string;
  schedule: string;
  capacity: number;
  enrolled: number;
  price: number | 'Free';
  benefits: string[];
  curriculum: {
    title: string;
    items: string[];
  }[];
  reviews: {
    id: string;
    name: string;
    avatar: string;
    date: string;
    rating: number;
    comment: string;
  }[];
};

// This is mock data that would normally come from an API call to the Laravel backend
const mockMentorshipProgram: MentorshipProgram = {
  id: '1',
  title: 'Frontend Development Career Acceleration',
  mentorName: 'Sarah Johnson',
  mentorTitle: 'Senior Frontend Engineer',
  mentorCompany: 'Google',
  mentorAvatar: '/assets/mentors/avatar.jpg',
  mentorBio:
    "I'm a Senior Frontend Engineer at Google with over 10 years of experience in building complex web applications. I specialize in React, TypeScript, and modern JavaScript frameworks. I'm passionate about helping aspiring developers grow their skills and advance their careers.",
  mentorExperience: [
    {
      company: 'Google',
      role: 'Senior Frontend Engineer',
      duration: '2019 - Present',
      description:
        'Leading the frontend development for Google Cloud Platform products.',
    },
    {
      company: 'Facebook',
      role: 'Frontend Engineer',
      duration: '2016 - 2019',
      description:
        "Worked on React and contributed to Facebook's internal design system.",
    },
    {
      company: 'Airbnb',
      role: 'Frontend Developer',
      duration: '2013 - 2016',
      description:
        "Helped build and maintain Airbnb's user interface and booking system.",
    },
  ],
  mentorEducation: [
    {
      institution: 'Stanford University',
      degree: "Master's",
      field: 'Computer Science',
      year: '2013',
    },
    {
      institution: 'University of California, Berkeley',
      degree: "Bachelor's",
      field: 'Computer Science',
      year: '2011',
    },
  ],
  mentorSkills: [
    'React',
    'TypeScript',
    'JavaScript',
    'HTML/CSS',
    'Redux',
    'GraphQL',
    'Next.js',
    'Unit Testing',
    'Performance Optimization',
    'UI/UX Design',
  ],
  mentorAchievements: [
    'Published author of "Modern Frontend Development" book',
    'Speaker at React Conf 2022',
    'Contributor to open-source React libraries',
    'Tech blogger with 50,000+ followers',
    "Winner of Google's internal developer award",
  ],
  overview:
    'Accelerate your frontend development career with personalized mentorship from a Google Senior Frontend Engineer.',
  description:
    "This 12-week mentorship program is designed to help you master modern frontend development skills and advance your career. You'll receive personalized guidance, code reviews, career advice, and exclusive resources from a senior engineer with experience at top tech companies.\n\nWhether you're looking to break into tech, level up your skills, or prepare for senior roles, this program will provide you with the knowledge, feedback, and support you need to achieve your goals.",
  type: 'one-on-one',
  duration: '12 weeks',
  schedule: 'Weekly 1-hour sessions + async communication',
  capacity: 5,
  enrolled: 3,
  price: 499,
  benefits: [
    'Personalized learning path tailored to your goals',
    'Weekly 1-on-1 video calls with your mentor',
    'Unlimited text-based communication between sessions',
    'Code reviews and feedback on your projects',
    'Resume and portfolio review',
    'Mock interviews and technical assessment preparation',
    'Job search and career advancement strategies',
    'Access to exclusive learning resources and exercises',
    'Certificate of completion for your LinkedIn profile',
    'Continued support after program completion',
  ],
  curriculum: [
    {
      title: 'Foundation Building (Weeks 1-3)',
      items: [
        'Assessment of your current skills and knowledge gaps',
        'Development of a personalized learning plan',
        'Setting up your development environment and workflow',
        'Modern JavaScript fundamentals and best practices',
        'Understanding React core concepts and patterns',
      ],
    },
    {
      title: 'Skill Development (Weeks 4-7)',
      items: [
        'Building complex React applications with hooks and context',
        'State management strategies with Redux and alternatives',
        'API integration and data fetching patterns',
        'Performance optimization techniques',
        'Testing strategies and implementation',
        'TypeScript fundamentals and advanced types',
      ],
    },
    {
      title: 'Project Work (Weeks 8-10)',
      items: [
        'Building a portfolio project with mentor guidance',
        'Code reviews and refactoring sessions',
        'Implementing industry best practices',
        'Debugging and troubleshooting techniques',
        'Documentation and knowledge sharing',
      ],
    },
    {
      title: 'Career Development (Weeks 11-12)',
      items: [
        'Resume and LinkedIn profile optimization',
        'Portfolio refinement and presentation',
        'Interview preparation and mock technical interviews',
        'Salary negotiation strategies',
        'Long-term career planning and growth strategies',
      ],
    },
  ],
  reviews: [
    {
      id: 'r1',
      name: 'Michael Smith',
      avatar: '/assets/avatar.jpg',
      date: '2023-10-15',
      rating: 5,
      comment:
        "Sarah's mentorship completely transformed my frontend skills and helped me land my dream job. Her guidance on React patterns and best practices was invaluable, and she gave me excellent feedback on my portfolio projects. The mock interviews we did prepared me perfectly for the real thing!",
    },
    {
      id: 'r2',
      name: 'Jennifer Lee',
      avatar: '/assets/avatar.jpg',
      date: '2023-09-22',
      rating: 5,
      comment:
        "I was stuck in my career until I joined Sarah's mentorship program. Her personalized approach helped me identify my strengths and weaknesses, and she created a learning plan that addressed exactly what I needed. The weekly calls kept me accountable, and her insights from working at Google were incredibly helpful.",
    },
    {
      id: 'r3',
      name: 'David Wilson',
      avatar: '/assets/avatar.jpg',
      date: '2023-08-30',
      rating: 4,
      comment:
        "This mentorship program offers excellent value for the price. Sarah is knowledgeable, patient, and genuinely invested in your success. I especially appreciated the code reviews and feedback on my projects. The only reason I'm not giving 5 stars is that I wish the program was longer!",
    },
  ],
};

export default function MentorshipDetailPage() {
  // In a real app, we would fetch the mentorship data using the ID from params
  const mentorship = mockMentorshipProgram;

  const formatPrice = (price: number | 'Free') => {
    if (price === 'Free') return 'Free';
    return `$${price}`;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50">
      {/* Hero section */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm font-medium text-indigo-600 mb-2">
                <Link href="/mentorship" className="hover:underline">
                  Mentorship Programs
                </Link>
                <span className="mx-2">›</span>
                <span>{mentorship.type.replace('-', ' ')}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {mentorship.title}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {mentorship.overview}
              </p>

              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={mentorship.mentorAvatar}
                    alt={mentorship.mentorName}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {mentorship.mentorName}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {mentorship.mentorTitle} at {mentorship.mentorCompany}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center bg-indigo-50 rounded-full px-4 py-2 text-sm text-indigo-700">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {mentorship.duration}
                </div>
                <div className="flex items-center bg-indigo-50 rounded-full px-4 py-2 text-sm text-indigo-700">
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
                  {mentorship.type
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </div>
                <div className="flex items-center bg-indigo-50 rounded-full px-4 py-2 text-sm text-indigo-700">
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
                  {mentorship.schedule}
                </div>
              </div>

              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold text-gray-900 mr-4">
                  {formatPrice(mentorship.price)}
                </span>
                <div className="text-sm text-gray-600 border-l border-gray-300 pl-4">
                  <div>{mentorship.enrolled} enrolled</div>
                  <div>
                    {mentorship.capacity - mentorship.enrolled} spots left
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                  Apply for Mentorship
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
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
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Ask a Question
                </button>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg">
              <Image
                src={mentorship.mentorAvatar}
                alt={mentorship.mentorName}
                width={600}
                height={600}
                className="object-cover w-full h-full"
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
            {/* About the program */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About the Program
              </h2>
              <p className="text-gray-700 whitespace-pre-line mb-6">
                {mentorship.description}
              </p>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                What You&apos;ll Learn
              </h3>
              <div className="space-y-6">
                {mentorship.curriculum.map((section, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-indigo-200 pl-4"
                  >
                    <h4 className="font-bold text-gray-900 mb-2">
                      {section.title}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-700">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Program Benefits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mentorship.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 mt-1"
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
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  {mentorship.reviews.reduce(
                    (acc, review) => acc + review.rating,
                    0,
                  ) / mentorship.reviews.length}{' '}
                  / 5
                </span>
              </div>

              <div className="space-y-6">
                {mentorship.reviews.map((review) => (
                  <div
                    key={review.id}
                    className={`pb-6 ${review.id !== mentorship.reviews[mentorship.reviews.length - 1].id ? 'border-b border-gray-200' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                        <Image
                          src={review.avatar}
                          alt={review.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            {review.name}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                        {renderStars(review.rating)}
                        <p className="mt-2 text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* About the mentor */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                About Your Mentor
              </h3>
              <p className="text-gray-700 mb-6">{mentorship.mentorBio}</p>

              <h4 className="font-bold text-gray-900 mb-2">Experience</h4>
              <div className="space-y-3 mb-6">
                {mentorship.mentorExperience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-3">
                    <div className="font-medium text-gray-900">{exp.role}</div>
                    <div className="text-sm text-gray-600">
                      {exp.company} • {exp.duration}
                    </div>
                    {exp.description && (
                      <p className="text-sm text-gray-700 mt-1">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <h4 className="font-bold text-gray-900 mb-2">Education</h4>
              <div className="space-y-3 mb-6">
                {mentorship.mentorEducation.map((edu, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-3">
                    <div className="font-medium text-gray-900">
                      {edu.degree} in {edu.field}
                    </div>
                    <div className="text-sm text-gray-600">
                      {edu.institution} • {edu.year}
                    </div>
                  </div>
                ))}
              </div>

              <h4 className="font-bold text-gray-900 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {mentorship.mentorSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <h4 className="font-bold text-gray-900 mb-2">Achievements</h4>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {mentorship.mentorAchievements.map((achievement, index) => (
                  <li key={index} className="mb-1">
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Apply section */}
      <div className="bg-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-lg text-indigo-700 mb-8 max-w-3xl mx-auto">
              Apply now to join {mentorship.mentorName}&apos;s mentorship program and
              take your skills to the next level. Only{' '}
              {mentorship.capacity - mentorship.enrolled} spots left!
            </p>
            <button className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-lg">
              Apply for Mentorship
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
