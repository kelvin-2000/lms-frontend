import React, { useState, useEffect } from 'react';
import { Course } from '@/types/courses';
import {
  createCourse,
  updateCourse,
  deleteCourse,
} from '@/services/courseService';
import { toast } from 'react-hot-toast';

// type CourseSelectCallback = (course: Course) => void;

interface CourseManagementProps {
  courses: Course[];
  onCoursesUpdated: () => void;
  // eslint-disable-next-line no-unused-vars
  onCourseSelect?: (course: Course) => void;
}

const CourseManagement: React.FC<CourseManagementProps> = ({
  courses,
  onCoursesUpdated,
  onCourseSelect,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_description: '',
    description: '',
    long_description: '',
    learning_outcomes: [''],
    requirements: [''],
    category: '',
    level: 'beginner',
    price: '0',
    status: 'draft',
    thumbnail_url: '/assets/courses/web.jpg',
    duration: '0',
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field when it's changed
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleArrayChange = (
    field: 'learning_outcomes' | 'requirements',
    index: number,
    value: string,
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));

    // Clear validation error for this field when it's changed
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const addArrayItem = (field: 'learning_outcomes' | 'requirements') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (
    field: 'learning_outcomes' | 'requirements',
    index: number,
  ) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      // Format the data for submission
      const submissionData = {
        ...formData,
        description: formData.short_description,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration, 10) || 0,
        learning_outcomes: formData.learning_outcomes.filter(
          (item) => item.trim() !== '',
        ),
        requirements: formData.requirements.filter(
          (item) => item.trim() !== '',
        ),
      };

      let result;
      if (editingCourse) {
        console.log('Updating course:', editingCourse.id);
        result = await updateCourse(String(editingCourse.id), submissionData);
        console.log('Course update response:', result);
        toast.success('Course updated successfully');
      } else {
        console.log('Creating new course');
        result = await createCourse(submissionData);
        console.log('Course creation response:', result);
        toast.success('Course created successfully');
      }
      setIsModalOpen(false);
      onCoursesUpdated();
    } catch (error) {
      console.error('Error saving course:', error);

      // Check if it's a validation error
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      if (errorMessage.startsWith('Validation error:')) {
        // Parse the validation error message and extract field errors
        const errorsMap: Record<string, string[]> = {};

        const errorFields = errorMessage
          .replace('Validation error: ', '')
          .split('; ');
        errorFields.forEach((fieldError) => {
          const [field, messages] = fieldError.split(': ');
          errorsMap[field] = messages.split(', ');
        });

        setValidationErrors(errorsMap);
        toast.error('Please correct the validation errors');
      } else {
        toast.error(`Failed to save course: ${errorMessage}`);
      }
    }
  };

  const handleDelete = async (courseId: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(String(courseId));
        toast.success('Course deleted successfully');
        onCoursesUpdated();
      } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('Failed to delete course');
      }
    }
  };

  useEffect(() => {
    if (editingCourse) {
      setFormData({
        title: editingCourse.title || '',
        slug: editingCourse.slug || '',
        short_description:
          editingCourse.short_description || editingCourse.description || '',
        description:
          editingCourse.description || editingCourse.short_description || '',
        long_description: editingCourse.long_description || '',
        learning_outcomes: editingCourse.learning_outcomes?.length
          ? editingCourse.learning_outcomes
          : [''],
        requirements: editingCourse.requirements?.length
          ? editingCourse.requirements
          : [''],
        category: editingCourse.category || '',
        level: editingCourse.level?.toLowerCase() || 'beginner',
        price: String(editingCourse.price || 0),
        status: editingCourse.status || 'draft',
        thumbnail_url:
          editingCourse.thumbnail_url || editingCourse.thumbnail || '',
        duration: String(editingCourse.duration || 0),
      });
    }
  }, [editingCourse]);

  // If not mounted yet (SSR), don't render anything
  if (!isMounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Courses</h2>
        <button
          onClick={() => {
            setEditingCourse(null);
            setValidationErrors({});
            setFormData({
              title: '',
              slug: '',
              short_description: '',
              description: '',
              long_description: '',
              learning_outcomes: [''],
              requirements: [''],
              category: '',
              level: 'beginner',
              price: '0',
              status: 'draft',
              thumbnail_url: '/assets/courses/web.jpg',
              duration: '0',
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create New Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-500">
            No courses found. Create your first course!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
              {(course.thumbnail_url || course.thumbnail) && (
                <div
                  className="mb-4 h-40 bg-cover bg-center rounded-md"
                  style={{
                    backgroundImage: `url(${course.thumbnail_url || course.thumbnail})`,
                  }}
                ></div>
              )}
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-2">
                {course.short_description || course.description}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-indigo-600 font-bold">
                  ${course.price}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    course.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {course.status.charAt(0).toUpperCase() +
                    course.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setEditingCourse(course);
                    setValidationErrors({});
                    setFormData({
                      title: course.title || '',
                      slug: course.slug || '',
                      short_description:
                        course.short_description || course.description || '',
                      description:
                        course.description || course.short_description || '',
                      long_description: course.long_description || '',
                      learning_outcomes: course.learning_outcomes || [''],
                      requirements: course.requirements || [''],
                      category: course.category || '',
                      level: course.level?.toLowerCase() || 'beginner',
                      price: String(course.price || 0),
                      status: course.status || 'draft',
                      thumbnail_url:
                        course.thumbnail_url || course.thumbnail || '',
                      duration: String(course.duration || 0),
                    });
                    setIsModalOpen(true);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
                {onCourseSelect && (
                  <button
                    onClick={() => onCourseSelect(course)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Videos
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingCourse ? 'Edit Course' : 'Create New Course'}
            </h3>

            {/* Display validation errors if any */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="font-medium text-red-700">
                  Please fix the following errors:
                </div>
                <ul className="mt-2 text-sm text-red-700">
                  {Object.entries(validationErrors).map(([field, errors]) => (
                    <li key={field}>
                      <strong className="capitalize">
                        {field.replace('_', ' ')}:
                      </strong>{' '}
                      {errors.join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.title
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.title[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.slug
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.slug && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.slug[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Short Description
                  </label>
                  <input
                    type="text"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.short_description ||
                      validationErrors.description
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  />
                  {(validationErrors.short_description ||
                    validationErrors.description) && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.short_description?.[0] ||
                        validationErrors.description?.[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.level
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="web_development">Web Development</option>
                    <option value="mobile_development">
                      Mobile Development
                    </option>
                    <option value="design">Design</option>
                    <option value="database">Database</option>
                  </select>
                  {/* <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.category
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  /> */}
                  {validationErrors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.category[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Level
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.level
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {validationErrors.level && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.level[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.price
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                    min="0"
                    step="0.01"
                  />
                  {validationErrors.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.price[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.duration
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                    min="0"
                  />
                  {validationErrors.duration && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.duration[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.status
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                  {validationErrors.status && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.status[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thumbnail URL
                  </label>
                  <input
                    type="text"
                    name="thumbnail_url"
                    value={formData.thumbnail_url}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.thumbnail_url
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.thumbnail_url && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.thumbnail_url[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Long Description
                </label>
                <textarea
                  name="long_description"
                  value={formData.long_description}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                    validationErrors.long_description
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  rows={4}
                  required
                />
                {validationErrors.long_description && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.long_description[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Outcomes
                </label>
                {formData.learning_outcomes.map((outcome, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={outcome}
                      onChange={(e) =>
                        handleArrayChange(
                          'learning_outcomes',
                          index,
                          e.target.value,
                        )
                      }
                      className={`flex-grow rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                        validationErrors.learning_outcomes
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter a learning outcome"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayItem('learning_outcomes', index)
                      }
                      className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {validationErrors.learning_outcomes && (
                  <p className="mt-1 mb-2 text-sm text-red-600">
                    {validationErrors.learning_outcomes[0]}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => addArrayItem('learning_outcomes')}
                  className="mt-1 px-3 py-1 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200"
                >
                  Add Outcome
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) =>
                        handleArrayChange('requirements', index, e.target.value)
                      }
                      className={`flex-grow rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                        validationErrors.requirements
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter a requirement"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('requirements', index)}
                      className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {validationErrors.requirements && (
                  <p className="mt-1 mb-2 text-sm text-red-600">
                    {validationErrors.requirements[0]}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => addArrayItem('requirements')}
                  className="mt-1 px-3 py-1 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200"
                >
                  Add Requirement
                </button>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setValidationErrors({});
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
