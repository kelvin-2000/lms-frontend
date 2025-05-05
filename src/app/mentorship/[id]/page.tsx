'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

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

// API Response Interface
interface ApiMentorshipProgram {
  id: number;
  title: string;
  description: string;
  long_description: string | null;
  overview: string | null;
  mentor_id: number;
  mentor: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    title: string | null;
    company: string | null;
    bio: string | null;
    experience: MentorExperience[] | null;
    education: MentorEducation[] | null;
    skills: string[] | null;
    achievements: string[] | null;
  };
  type: string;
  duration: number;
  schedule: string | null;
  capacity: number;
  enrolled_mentees: number;
  price: number;
  benefits: string[] | null;
  curriculum:
    | {
        title: string;
        items: string[];
      }[]
    | null;
  reviews:
    | {
        id: number;
        user: {
          id: number;
          name: string;
          avatar: string | null;
        };
        created_at: string;
        rating: number;
        comment: string;
      }[]
    | null;
  created_at: string;
  updated_at: string;
}

// Frontend UI Model
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

// Default avatar image
const DEFAULT_AVATAR = '/assets/default-avatar.jpg';

export default function MentorshipDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [mentorship, setMentorship] = useState<MentorshipProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [applicationMessage, setApplicationMessage] = useState<string | null>(
    null,
  );
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [motivation, setMotivation] = useState('');
  const [motivationError, setMotivationError] = useState<string | null>(null);
  const [applicationChecked, setApplicationChecked] = useState(false);

  useEffect(() => {
    const fetchMentorshipData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/mentorship-programs/${id}`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch mentorship program data');
        }

        const data = await response.json();

        if (data.success) {
          const apiProgram: ApiMentorshipProgram = data.data;

          // Transform API data to match our UI model
          const transformedProgram: MentorshipProgram = {
            id: apiProgram.id.toString(),
            title: apiProgram.title,
            mentorName: apiProgram.mentor.name,
            mentorTitle: apiProgram.mentor.title || 'Mentor',
            mentorCompany: apiProgram.mentor.company || 'Independent',
            mentorAvatar: apiProgram.mentor.avatar || DEFAULT_AVATAR,
            mentorBio: apiProgram.mentor.bio || 'No bio provided',
            mentorExperience: apiProgram.mentor.experience || [],
            mentorEducation: apiProgram.mentor.education || [],
            mentorSkills: apiProgram.mentor.skills || [],
            mentorAchievements: apiProgram.mentor.achievements || [],
            overview:
              apiProgram.overview ||
              apiProgram.description.substring(0, 150) + '...',
            description: apiProgram.long_description || apiProgram.description,
            type: (apiProgram.type as MentorshipType) || 'one-on-one',
            duration: `${apiProgram.duration}`,
            schedule: apiProgram.schedule || 'Flexible schedule',
            capacity: apiProgram.capacity,
            enrolled: apiProgram.enrolled_mentees,
            price: apiProgram.price === 0 ? 'Free' : apiProgram.price,
            benefits: apiProgram.benefits || [
              'Learn from an experienced mentor',
              'Practical, hands-on guidance',
              'Career advice and development',
            ],
            curriculum: apiProgram.curriculum || [
              {
                title: 'Program Content',
                items: ['Detailed curriculum will be available soon.'],
              },
            ],
            reviews:
              apiProgram.reviews?.map((review) => ({
                id: review.id.toString(),
                name: review.user.name,
                avatar: review.user.avatar || DEFAULT_AVATAR,
                date: new Date(review.created_at).toISOString().split('T')[0],
                rating: review.rating,
                comment: review.comment,
              })) || [],
          };

          setMentorship(transformedProgram);
        } else {
          setError('Failed to load mentorship program details');
        }
      } catch (err) {
        console.error('Error fetching mentorship program:', err);
        setError(
          'An error occurred while fetching the mentorship program. Please try again later.',
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMentorshipData();
    }
  }, [id, user]);

  // Add new useEffect to check application status
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (
        !user ||
        !id ||
        applicationStatus === 'success' ||
        applicationChecked
      ) {
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/mentorship-application/check-status`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              program_id: id,
              user_id: user.id,
            }),
          },
        );

        const data = await response.json();

        if (data.success && data.data && data.data.has_applied) {
          setApplicationStatus('success');
          setApplicationMessage(
            'You have already applied to this mentorship program.',
          );
        }
      } catch (err) {
        console.error('Error checking application status:', err);
        // Don't set error state - we just default to showing the apply button
      } finally {
        setApplicationChecked(true);
      }
    };

    checkApplicationStatus();
  }, [id, user, applicationStatus, applicationChecked]);

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

  const handleApplyForMentorship = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = `/login?redirect=/mentorship/${id}`;
      return;
    }

    // Show the application modal instead of immediately submitting
    setShowApplicationModal(true);
  };

  const submitApplication = async () => {
    // Validate motivation field
    if (!motivation.trim()) {
      setMotivationError(
        'Please provide your motivation for joining this mentorship program',
      );
      return;
    }

    try {
      setApplying(true);
      setApplicationStatus('idle');
      setApplicationMessage(null);
      setMotivationError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mentorship-programs/${id}/apply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            motivation: motivation,
          }),
        },
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setApplicationStatus('success');
        setApplicationMessage(
          'Your application has been submitted successfully! The mentor will review it soon.',
        );
        setShowApplicationModal(false);
        setApplicationChecked(true);
      } else {
        // Check for specific validation errors
        if (data.errors && data.errors.motivation) {
          setMotivationError(data.errors.motivation[0]);
        } else {
          setApplicationStatus('error');
          setApplicationMessage(
            data.message ||
              'Failed to submit application. Please try again later.',
          );
        }
      }
    } catch (err) {
      console.error('Error applying for mentorship:', err);
      setApplicationStatus('error');
      setApplicationMessage(
        'An error occurred while submitting your application. Please try again later.',
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !mentorship) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {error || 'Mentorship program not found'}
        </h2>
        <p className="text-gray-600 mb-8">
          We couldn&apos;t load the mentorship program details. Please try again
          later.
        </p>
        <Link
          href="/mentorship"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg"
        >
          Browse Mentorship Programs
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Apply for Mentorship Program
            </h3>
            <p className="text-gray-600 mb-4">
              Tell us why you want to join this mentorship program and what you
              hope to achieve.
            </p>

            <div className="mb-4">
              <label
                htmlFor="motivation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Motivation <span className="text-red-500">*</span>
              </label>
              <textarea
                id="motivation"
                rows={5}
                className={`w-full px-3 py-2 border ${motivationError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Explain why you want to join this program and what you hope to learn..."
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
              ></textarea>
              {motivationError && (
                <p className="mt-1 text-sm text-red-600">{motivationError}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowApplicationModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitApplication}
                disabled={applying}
                className={`px-4 py-2 rounded-md shadow-sm text-white ${
                  applying
                    ? 'bg-indigo-400'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {applying ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
                  {mentorship.price ? formatPrice(mentorship.price) : 'Free'}
                </span>
                <div className="text-sm text-gray-600 border-l border-gray-300 pl-4">
                  <div>{mentorship.enrolled || 0} enrolled</div>
                  <div>
                    {mentorship.capacity - (mentorship.enrolled || 0)} spots
                    left
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {user &&
                (user.role === 'student' || user.role === 'instructor') ? (
                  applicationStatus === 'success' ? (
                    <div className="px-6 py-3 font-medium rounded-lg bg-green-500 text-white">
                      Application Submitted
                    </div>
                  ) : (
                    <button
                      onClick={handleApplyForMentorship}
                      disabled={applying}
                      className={`px-6 py-3 font-medium rounded-lg transition-colors ${
                        applying
                          ? 'bg-indigo-400 text-white cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {applying ? 'Applying...' : 'Apply for Mentorship'}
                    </button>
                  )
                ) : (
                  !user && (
                    <Link
                      href={`/auth/login?redirect=${encodeURIComponent(`/mentorship/${id}`)}`}
                      className="px-6 py-3 font-medium rounded-lg transition-colors bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Login to Apply
                    </Link>
                  )
                )}

                {/* <button className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
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
                </button> */}
              </div>

              {applicationStatus !== 'idle' && (
                <div
                  className={`mt-4 px-4 py-3 rounded-md ${
                    applicationStatus === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {applicationMessage}
                </div>
              )}
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
                  {mentorship?.reviews.reduce(
                    (acc, review) => acc + (review?.rating || 0),
                    0,
                  ) || 0 / (mentorship?.reviews.length || 0)}{' '}
                  / 5
                </span>
              </div>

              <div className="space-y-6">
                {mentorship?.reviews.map((review) => (
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
              Apply now to join {mentorship.mentorName}&apos;s mentorship
              program and take your skills to the next level. Only{' '}
              {mentorship.capacity - (mentorship.enrolled || 0)} spots left!
            </p>
            {user && (user.role === 'student' || user.role === 'instructor') ? (
              applicationStatus === 'success' ? (
                <div className="inline-block px-8 py-4 font-medium rounded-lg bg-green-500 text-white text-lg">
                  Application Submitted
                </div>
              ) : (
                <button
                  onClick={handleApplyForMentorship}
                  disabled={applying}
                  className={`px-8 py-4 font-medium rounded-lg transition-colors text-lg ${
                    applying
                      ? 'bg-indigo-400 text-white cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {applying ? 'Applying...' : 'Apply for Mentorship'}
                </button>
              )
            ) : (
              !user && (
                <Link
                  href={`/auth/login?redirect=${encodeURIComponent(`/mentorship/${id}`)}`}
                  className="inline-block px-8 py-4 font-medium rounded-lg transition-colors text-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Login to Apply
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
