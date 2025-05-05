'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Types
type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

interface CourseVideo {
  id: number;
  title: string;
  duration: number;
  videoUrl: string;
  isFree: boolean;
}

interface CourseInstructor {
  id: number;
  name: string;
  avatar: string | null;
  title: string | null;
  bio: string | null;
}

interface CourseDiscussion {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string | null;
  title: string;
  content: string;
  date: string;
  replies: number | null;
}

interface ApiDiscussion {
  id: number;
  user_id: number;
  userName: string;
  userAvatar: string | null;
  title: string;
  content: string;
  date: string;
  replies: number | null;
  user?: {
    name: string;
    avatar: string | null;
  };
}

interface ApiVideo {
  id: number;
  title: string;
  duration: number;
  videoUrl: string;
  isFree: boolean;
}

interface CourseDetails {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  thumbnailUrl: string | null;
  level: CourseLevel;
  duration: number;
  totalVideos: number;
  price: number | string;
  rating: number;
  ratingCount: number;
  studentsCount: number;
  lastUpdate: string | null;
  requirements: string[];
  whatYouWillLearn: string[];
  instructor: CourseInstructor;
  videos: CourseVideo[];
  discussions: CourseDiscussion[];
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<CourseVideo | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const [enrollmentChecked, setEnrollmentChecked] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch course data');
        }

        const data = await response.json();

        if (data.success) {
          // Transform API response to match our interface
          const courseData = {
            ...data.data,
            // Format duration from seconds to readable format
            // Ensure we have dates in the right format
            lastUpdate: data.data.lastUpdate
              ? new Date(data.data.lastUpdate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })
              : 'Recently updated',
          };

          // Additional API calls for videos and discussions if user is authenticated
          let videos = data.data.videos || [];
          let discussions = data.data.discussions || [];

          if (user) {
            try {
              // Fetch videos if not included in the initial response
              if (!videos.length) {
                const videosResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/courses/${id}/videos`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                  },
                );

                if (videosResponse.ok) {
                  const videosData = await videosResponse.json();
                  if (videosData.success) {
                    videos = videosData.data;
                  }
                }
              }

              // Fetch discussions if not included in the initial response
              if (!discussions.length) {
                const discussionsResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/courses/${id}/discussions`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                  },
                );

                if (discussionsResponse.ok) {
                  const discussionsData = await discussionsResponse.json();
                  if (discussionsData.success) {
                    // Transform discussion data to match our interface
                    discussions = discussionsData.data.map(
                      (discussion: ApiDiscussion) => ({
                        id: discussion.id,
                        userId: discussion.user_id,
                        userName: discussion.user?.name || discussion.userName,
                        userAvatar:
                          discussion.user?.avatar || discussion.userAvatar,
                        title: discussion.title,
                        content: discussion.content,
                        date:
                          discussion.date ||
                          formatDate(new Date().toISOString()),
                        replies: discussion.replies || 0,
                      }),
                    );
                  }
                }
              }
            } catch (err) {
              console.error('Error fetching additional course data:', err);
              // We don't set the main error state here to allow the page to still render
            }
          }

          setCourse({
            ...courseData,
            videos: videos.map((video: ApiVideo) => ({
              id: video.id,
              title: video.title,
              duration: video.duration,
              videoUrl: video.videoUrl,
              isFree: video.isFree,
            })),
            discussions: discussions.map((discussion: any) => ({
              id: discussion.id,
              userId: discussion.userId || discussion.user_id,
              userName: discussion.userName,
              userAvatar: discussion.userAvatar,
              title: discussion.title,
              content: discussion.content,
              date: discussion.date,
              replies: discussion.replies || 0,
            })),
          });
        } else {
          setError('Failed to load course details');
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(
          'An error occurred while fetching the course. Please try again later.',
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseData();
    }
  }, [id, user]);

  // Add new useEffect to check enrollment status
  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (!user || user.role !== 'student' || enrollmentChecked) {
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/enrollment/check-status`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              course_id: id,
              user_id: user.id,
            }),
          },
        );

        const data = await response.json();
        console.log('data', data);
        if (data.success && data.data && data.data.is_enrolled) {
          setEnrollmentSuccess(true);
        }
      } catch (err) {
        console.error('Error checking enrollment status:', err);
        // Don't set error state - we just default to showing the enroll button
      } finally {
        setEnrollmentChecked(true);
      }
    };

    checkEnrollmentStatus();
  }, [id, user, enrollmentChecked]);

  // Set the first video as current video when course data is loaded
  useEffect(() => {
    if (course?.videos && course.videos.length > 0 && !currentVideo) {
      setCurrentVideo(course.videos[0]);
    }
  }, [course, currentVideo]);

  // Helper function to format duration from seconds
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  // Format seconds to MM:SS for video duration
  const formatVideoDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Fallback image for when thumbnailUrl is null
  const DEFAULT_THUMBNAIL = '/assets/courses/default-thumbnail.jpg';
  const DEFAULT_AVATAR = '/assets/default-avatar.jpg';

  // Helper function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    // Regular YouTube URL formats:
    // - https://www.youtube.com/watch?v=VIDEO_ID
    // - https://youtu.be/VIDEO_ID
    // - https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID
    // - https://youtu.be/VIDEO_ID?list=PLAYLIST_ID

    // Extract the video ID
    let videoId = '';

    if (url.includes('youtube.com/watch')) {
      // For format: https://www.youtube.com/watch?v=VIDEO_ID
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v') || '';
    } else if (url.includes('youtu.be/')) {
      // For format: https://youtu.be/VIDEO_ID
      videoId = url.split('youtu.be/')[1];
      // Remove any query parameters
      if (videoId.includes('?')) {
        videoId = videoId.split('?')[0];
      }
    }

    // Check if there's a playlist parameter
    let playlistId = '';
    if (url.includes('list=')) {
      const urlParts = url.split('list=');
      if (urlParts.length > 1) {
        playlistId = urlParts[1];
        // Remove any additional parameters
        if (playlistId.includes('&')) {
          playlistId = playlistId.split('&')[0];
        }
      }
    }

    // Return the embed URL
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}${playlistId ? `?list=${playlistId}` : ''}`;
    }

    // Return the original URL if we couldn't parse it
    return url;
  };

  const renderTabContent = () => {
    if (!course) return null;

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
              {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 ? (
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
              ) : (
                <p className="text-gray-500">
                  The instructor hasn&apos;t added learning objectives yet.
                </p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Requirements
              </h3>
              {course.requirements && course.requirements.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {course.requirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  No specific requirements for this course.
                </p>
              )}
            </div>
          </div>
        );
      case 'curriculum':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Course Curriculum
            </h2>
            <div className="mb-4">
              <p className="text-gray-500">
                {course.videos?.length || 0} videos •{' '}
                {formatDuration(course.duration)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              {course.videos && course.videos.length > 0 ? (
                <div className="space-y-4">
                  {course.videos.map((video) => (
                    <div
                      key={video.id}
                      className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors`}
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-6 h-6 text-gray-400 mr-4"
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
                            {formatVideoDuration(video.duration)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {/* {video.isFree ? (
                          <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                            Free Preview
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                            Premium
                          </span>
                        )} */}
                        <button
                          disabled={!enrollmentSuccess}
                          onClick={() => handleVideoSelect(video)}
                          className={`px-3 py-1.5 text-sm ${enrollmentSuccess ? 'bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                          {enrollmentSuccess
                            ? 'Watch Video'
                            : 'Enroll to Watch'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No videos have been added to this course yet.
                  </p>
                </div>
              )}
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
                    src={course.instructor.avatar || DEFAULT_AVATAR}
                    alt={course.instructor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {course.instructor.name}
                  </h3>
                  {course.instructor.title && (
                    <p className="text-gray-500 mb-2">
                      {course.instructor.title}
                    </p>
                  )}
                  {course.instructor.bio && (
                    <p className="text-gray-700">{course.instructor.bio}</p>
                  )}
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
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No reviews yet. Be the first to review this course!
                </p>
              </div>
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
              {course.discussions && course.discussions.length > 0 ? (
                <div className="space-y-6">
                  {course.discussions.map((discussion) => (
                    <div
                      key={discussion.id}
                      className="border-b border-gray-200 pb-6 last:border-b-0"
                    >
                      <div className="flex items-start">
                        <div className="w-10 h-10 relative rounded-full overflow-hidden mr-4 flex-shrink-0">
                          <Image
                            src={discussion.userAvatar || DEFAULT_AVATAR}
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
                            {discussion.replies || 0} replies
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No discussions yet. Start a new discussion!
                  </p>
                  {user ? (
                    <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                      Start Discussion
                    </button>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">
                      <Link
                        href="/auth/login"
                        className="text-indigo-600 hover:underline"
                      >
                        Log in
                      </Link>{' '}
                      to participate in discussions
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Add function to handle video selection
  const handleVideoSelect = (video: CourseVideo) => {
    if (id && video && video.id) {
      // Navigate to the video page instead of playing inline
      window.location.href = `/courses/${id}/video/${video.id}`;
    }
  };

  // Modify enrollCourse function to update enrollmentChecked
  const enrollCourse = async () => {
    if (!user) {
      router.push(
        '/auth/login?redirect=' + encodeURIComponent(`/courses/${id}`),
      );
      return;
    }

    try {
      setEnrolling(true);
      setEnrollmentError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/enroll`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            course_id: id,
            user_id: user.id,
            user_role: user.role,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setEnrollmentSuccess(true);
        setEnrollmentChecked(true);
        // Optional: You can update the UI to show enrolled status or redirect to the course content
      } else {
        setEnrollmentError(data.message || 'Failed to enroll in the course');
      }
    } catch (err) {
      console.error('Error enrolling in course:', err);
      setEnrollmentError(
        'An error occurred while enrolling. Please try again later.',
      );
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {error || 'Course not found'}
        </h2>
        <p className="text-gray-600 mb-8">
          We couldn&apos;t load the course details. Please try again later.
        </p>
        <Link
          href="/courses"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg"
        >
          Browse Courses
        </Link>
      </div>
    );
  }

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
                      src={course.instructor.avatar || DEFAULT_AVATAR}
                      alt={course.instructor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      Instructor: {course.instructor.name}
                    </p>
                    <p className="text-sm text-indigo-100">
                      {course.instructor.title || 'Instructor'}
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
                  <span>{formatDuration(course.duration)}</span>
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
                  <span>{course.videos?.length || 0} videos</span>
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
                {course.lastUpdate && (
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
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                {user && user.role === 'student' ? (
                  <button
                    onClick={enrollCourse}
                    disabled={enrolling || enrollmentSuccess}
                    className={`px-6 py-3 font-medium rounded-lg transition-colors ${
                      enrollmentSuccess
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    {enrolling ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
                        Enrolling...
                      </span>
                    ) : enrollmentSuccess ? (
                      'Enrolled'
                    ) : (
                      `Enroll Now ${
                        typeof course?.price === 'string' &&
                        parseFloat(course.price) === 0
                          ? '(Free)'
                          : `($${
                              typeof course?.price === 'number'
                                ? course.price.toFixed(2)
                                : course?.price
                                  ? parseFloat(course.price).toFixed(2)
                                  : '0.00'
                            })`
                      }`
                    )}
                  </button>
                ) : !user ? (
                  <Link
                    href={`/auth/login?redirect=${encodeURIComponent(`/courses/${id}`)}`}
                    className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Login to Enroll
                  </Link>
                ) : null}
              </div>
              {enrollmentError && (
                <div className="mt-2 text-red-600 text-sm">
                  {enrollmentError}
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              {currentVideo && currentVideo.videoUrl ? (
                <div className="w-full rounded-lg overflow-hidden shadow-xl">
                  <div className="relative pt-[56.25%]">
                    {' '}
                    {/* 16:9 Aspect Ratio */}
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={getYouTubeEmbedUrl(currentVideo.videoUrl)}
                      title={currentVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="bg-indigo-900 text-white py-2 px-4 text-sm font-medium">
                    {currentVideo.title}
                  </div>
                </div>
              ) : (
                <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src={course.thumbnailUrl || DEFAULT_THUMBNAIL}
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
              )}
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
          {/* <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Course Curriculum
              </h3>
              <div className="mb-4">
                <p className="text-gray-500">
                  {course.videos?.length || 0} videos •{' '}
                  {formatDuration(course.duration)}
                </p>
              </div>

              {course.videos && course.videos.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {course.videos.slice(0, 5).map((video) => (
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
                            {formatVideoDuration(video.duration)}
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
              ) : (
                <div className="text-center py-8 mb-6">
                  <p className="text-gray-500">
                    No videos have been added to this course yet.
                  </p>
                </div>
              )}

              {course.videos && course.videos.length > 5 && (
                <button className="w-full py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors mb-4">
                  Show All Content
                </button>
              )}

              <button className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                {typeof course.price === 'string' &&
                parseFloat(course.price) === 0
                  ? 'Enroll for Free'
                  : 'Enroll in Course'}
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
