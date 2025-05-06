import React, { useState, useEffect } from 'react';
import {
  CourseVideo,
  CourseVideoCreateData,
  createCourseVideo,
  updateCourseVideo,
} from '@/services/courseService';
import { toast } from 'react-hot-toast';

interface CourseVideoFormProps {
  courseId: number;
  video?: CourseVideo;
  onSuccess: () => void;
  onCancel: () => void;
}

const CourseVideoForm: React.FC<CourseVideoFormProps> = ({
  courseId,
  video,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CourseVideoCreateData>({
    course_id: courseId,
    title: '',
    description: '',
    video_url: '',
    duration: 0,
    position: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (video) {
      setFormData({
        course_id: video.course_id,
        title: video.title,
        description: video.description,
        video_url: video.video_url,
        duration: video.duration,
        position: video.position,
      });
    }
  }, [video]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;

    // Convert numeric inputs
    if (name === 'duration' || name === 'position') {
      processedValue = parseInt(value) || 0;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (video) {
        await updateCourseVideo(video.id, formData);
        toast.success('Video updated successfully');
      } else {
        await createCourseVideo(formData);
        toast.success('Video added successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving video:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'An error occurred while saving the video',
      );
      toast.error('Failed to save video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">
        {video ? 'Edit Video' : 'Add New Video'}
      </h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Video URL
          </label>
          <input
            type="url"
            name="video_url"
            value={formData.video_url}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration (seconds)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Position
            </label>
            <input
              type="number"
              name="position"
              value={formData.position}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : video ? 'Update Video' : 'Add Video'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseVideoForm;
