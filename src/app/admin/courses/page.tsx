'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CourseManagement from '@/components/courses/CourseManagement';
import CourseVideoForm from '@/components/courses/CourseVideoForm';
import { Course } from '@/types/courses';
import {
  CourseVideo,
  getCourses,
  getCourseVideos,
  deleteCourseVideo,
} from '@/services/courseService';
import { toast } from 'react-hot-toast';

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  // Regular expression to match different YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const CoursesPage = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseVideos, setCourseVideos] = useState<CourseVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videosError, setVideosError] = useState<string | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);
  const [activeTab, setActiveTab] = useState<'courses' | 'videos'>('courses');
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<CourseVideo | null>(null);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const fetchCourses = async (page: number = 1) => {
    if (!isBrowser) return;

    try {
      setLoading(true);

      const response = await getCourses(page, perPage);
      console.log('Courses response:', response);

      if (response && response.data) {
        setCourses(response.data);
        setCurrentPage(response.current_page);
        setTotalPages(response.last_page);
        setTotalCourses(response.total);
        setPerPage(response.per_page);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);

      if (
        error instanceof Error &&
        error.message === 'Authentication required'
      ) {
        // Redirect to admin login
        router.push(
          '/admin/login?redirect=' + encodeURIComponent('/admin/courses'),
        );
        return;
      } else {
        setError('Failed to load courses. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only run this effect in the browser
    if (!isBrowser) return;
    fetchCourses(1);
  }, [isBrowser, router]);

  useEffect(() => {
    // Fetch course videos when a course is selected
    if (!isBrowser || !selectedCourse) return;

    const fetchCourseVideos = async () => {
      try {
        setVideosLoading(true);
        setVideosError(null);

        const videos = await getCourseVideos(selectedCourse.id);

        if (Array.isArray(videos)) {
          setCourseVideos(videos);
        } else {
          setCourseVideos([]);
        }
      } catch (error) {
        console.error('Error fetching course videos:', error);

        if (
          error instanceof Error &&
          error.message === 'Authentication required'
        ) {
          router.push(
            '/admin/login?redirect=' + encodeURIComponent('/admin/courses'),
          );
          return;
        }

        setVideosError('Failed to load course videos. Please try again later.');
      } finally {
        setVideosLoading(false);
      }
    };

    fetchCourseVideos();
  }, [selectedCourse, isBrowser, router]);

  const handleCoursesUpdated = () => {
    fetchCourses(currentPage);
  };

  const handlePageChange = (page: number) => {
    fetchCourses(page);
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setActiveTab('videos');
  };

  const handleAddVideo = () => {
    setEditingVideo(null);
    setShowVideoForm(true);
  };

  const handleEditVideo = (video: CourseVideo) => {
    setEditingVideo(video);
    setShowVideoForm(true);
  };

  const handleDeleteVideo = async (videoId: number) => {
    if (!selectedCourse) return;

    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteCourseVideo(videoId);
        toast.success('Video deleted successfully');
        // Refresh the videos list
        const videos = await getCourseVideos(selectedCourse.id);
        setCourseVideos(Array.isArray(videos) ? videos : []);
      } catch (error) {
        console.error('Error deleting video:', error);
        toast.error('Failed to delete video');
      }
    }
  };

  const handleVideoFormSuccess = async () => {
    setShowVideoForm(false);
    setEditingVideo(null);

    if (!selectedCourse) return;

    try {
      setVideosLoading(true);
      const videos = await getCourseVideos(selectedCourse.id);
      setCourseVideos(Array.isArray(videos) ? videos : []);
    } catch (error) {
      console.error('Error refreshing videos:', error);
      toast.error('Failed to refresh videos');
    } finally {
      setVideosLoading(false);
    }
  };

  const handleVideoFormCancel = () => {
    setShowVideoForm(false);
    setEditingVideo(null);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    // Show at most 5 page numbers
    const maxPages = 5;
    const halfMaxPages = Math.floor(maxPages / 2);

    let startPage = Math.max(currentPage - halfMaxPages, 1);
    let endPage = Math.min(startPage + maxPages - 1, totalPages);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(endPage - maxPages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-6">
        <nav
          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
              currentPage === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span className="sr-only">Previous</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                currentPage === page
                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
              currentPage === totalPages
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span className="sr-only">Next</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold my-6 text-center">Manage Courses</h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('courses')}
            className={`mr-8 py-4 px-1 ${
              activeTab === 'courses'
                ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Courses
          </button>
          {selectedCourse && (
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-4 px-1 ${
                activeTab === 'videos'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Course Videos
            </button>
          )}
        </nav>
      </div>

      {loading && isBrowser ? (
        <div className="flex justify-center p-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent mb-4"></div>
            <p className="text-gray-500">Loading courses...</p>
          </div>
        </div>
      ) : (
        <>
          {activeTab === 'courses' && (
            <>
              <CourseManagement
                courses={courses}
                onCoursesUpdated={handleCoursesUpdated}
                onCourseSelect={handleCourseSelect}
              />

              {/* Pagination UI */}
              {renderPagination()}

              {totalCourses > 0 && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  Showing{' '}
                  {Math.min(perPage * (currentPage - 1) + 1, totalCourses)} to{' '}
                  {Math.min(perPage * currentPage, totalCourses)} of{' '}
                  {totalCourses} courses
                </div>
              )}
            </>
          )}

          {activeTab === 'videos' && selectedCourse && (
            <div className="bg-white rounded-lg shadow-md p-6">
              {showVideoForm ? (
                <CourseVideoForm
                  courseId={selectedCourse.id}
                  video={editingVideo || undefined}
                  onSuccess={handleVideoFormSuccess}
                  onCancel={handleVideoFormCancel}
                />
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                      Videos for: {selectedCourse.title}
                    </h2>
                    <div className="space-x-2">
                      <button
                        onClick={handleAddVideo}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Add Video
                      </button>
                      <button
                        onClick={() => setActiveTab('courses')}
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
                      >
                        Back to Courses
                      </button>
                    </div>
                  </div>

                  {videosError && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                      <p>{videosError}</p>
                    </div>
                  )}

                  {videosLoading ? (
                    <div className="flex justify-center p-12">
                      <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent mb-4"></div>
                        <p className="text-gray-500">
                          Loading course videos...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {courseVideos.length === 0 ? (
                        <div className="bg-gray-50 p-6 rounded-lg text-center">
                          <p className="text-gray-500">
                            No videos found for this course.
                          </p>
                          <button
                            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            onClick={handleAddVideo}
                          >
                            Add First Video
                          </button>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  No
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Video URL
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Title
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Duration
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {courseVideos.map((video) => (
                                <tr key={video.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {video.order}
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex flex-col space-y-2">
                                      {video.video_url ? (
                                        <>
                                          <div className="relative w-full max-w-xs h-24 bg-gray-100 rounded overflow-hidden">
                                            {getYouTubeVideoId(
                                              video.video_url,
                                            ) ? (
                                              <div className="relative w-full h-full">
                                                <Image
                                                  src={`https://img.youtube.com/vi/${getYouTubeVideoId(video.video_url)}/0.jpg`}
                                                  alt={`Thumbnail for ${video.title}`}
                                                  fill
                                                  sizes="(max-width: 768px) 100vw, 300px"
                                                  className="object-cover"
                                                  unoptimized
                                                />
                                              </div>
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  className="h-10 w-10 text-gray-500"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                  />
                                                </svg>
                                              </div>
                                            )}
                                            {/* Play button overlay */}
                                            <a
                                              href={video.video_url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity"
                                            >
                                              <span className="sr-only">
                                                Watch video
                                              </span>
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-12 w-12 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                />
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                              </svg>
                                            </a>
                                          </div>
                                        </>
                                      ) : (
                                        <span className="text-gray-500 italic text-sm">
                                          No video URL provided
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                      {video.title}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {video.description.substring(0, 50)}...
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {Math.floor(video.duration / 60)}:
                                    {(video.duration % 60)
                                      .toString()
                                      .padStart(2, '0')}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                      onClick={() => handleEditVideo(video)}
                                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteVideo(video.id)
                                      }
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CoursesPage;
