'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import '@/styles/globals.css';

// Types
interface CourseVideo {
  id: number;
  title: string;
  description?: string;
  duration: number;
  videoUrl: string;
  isFree: boolean;
}

interface CourseDetails {
  id: number;
  title: string;
  videos: CourseVideo[];
}

export default function CourseVideoPage() {
  const { id, videoId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [video, setVideo] = useState<CourseVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch course data first
        const courseResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`,
        );

        if (!courseResponse.ok) {
          throw new Error('Failed to fetch course data');
        }

        const courseData = await courseResponse.json();

        if (courseData.success) {
          // Set basic course data
          setCourse({
            id: courseData.data.id,
            title: courseData.data.title,
            videos: courseData.data.videos || [],
          });

          // Check if user is enrolled
          let isEnrolled = false;
          if (user) {
            try {
              const token = localStorage.getItem('token');
              const enrollmentResponse = await fetch(
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

              const enrollmentData = await enrollmentResponse.json();
              isEnrolled =
                enrollmentData.success &&
                enrollmentData.data &&
                enrollmentData.data.is_enrolled;
            } catch (err) {
              console.error('Error checking enrollment:', err);
              // Default to not enrolled if error
            }
          }

          // If the course response includes videos, find the current video
          if (courseData.data.videos && courseData.data.videos.length > 0) {
            const videos = courseData.data.videos;
            const currentVideo = videos.find(
              (v: any) => v.id.toString() === videoId.toString(),
            );

            const currentVideoIndex = videos.findIndex(
              (v: any) => v.id.toString() === videoId.toString(),
            );

            // Only allow access to first video if not enrolled
            if (!isEnrolled && currentVideoIndex > 0) {
              // Redirect to course page with error
              router.push(`/courses/${id}?error=enrollment_required`);
              return;
            }

            if (currentVideo) {
              setVideo(currentVideo);
            }
          }

          // If no videos in the initial response, fetch the specific video
          if (!courseData.data.videos || courseData.data.videos.length === 0) {
            const token = localStorage.getItem('token');
            const videoResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/courses/${id}/videos/${videoId}`,
              {
                headers: token
                  ? {
                      Authorization: `Bearer ${token}`,
                    }
                  : {},
              },
            );

            if (videoResponse.ok) {
              const videoData = await videoResponse.json();
              if (videoData.success) {
                setVideo(videoData.data);
              } else {
                setError('Video not available');
              }
            } else {
              // If the video is premium and user is not authenticated
              if (
                videoResponse.status === 401 ||
                videoResponse.status === 403
              ) {
                setError(
                  'This video requires enrollment in the course or authentication',
                );
              } else {
                setError('Failed to load video');
              }
            }
          }
        } else {
          setError('Failed to load course details');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    if (id && videoId) {
      fetchData();
    }
  }, [id, videoId, user]);

  // Format seconds to MM:SS for video duration
  const formatVideoDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {error || 'Video not found'}
        </h2>
        <p className="text-gray-600 mb-8">
          We couldn&apos;t load this video. It may be premium content or not
          available.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href={`/courses/${id}`}
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg"
          >
            Back to Course
          </Link>
          <Link
            href="/courses"
            className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="w-full aspect-video">
            <iframe
              className="w-full h-full"
              src={getYouTubeEmbedUrl(video.videoUrl)}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-sm text-indigo-600 mb-2">
                <Link href={`/courses/${id}`} className="hover:underline">
                  {course?.title || 'Back to Course'}
                </Link>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {video.title}
              </h1>
              {video.description && (
                <p className="mt-2 text-gray-700">{video.description}</p>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Duration: {formatVideoDuration(video.duration)}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => router.push(`/courses/${id}`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              Back to Course
            </button>

            {/* Optional: Share or Download buttons */}
            <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                ></path>
              </svg>
              Share
            </button>
          </div>
        </div>

        {/* Additional course content like related videos could go here */}
      </div>
    </div>
  );
}
