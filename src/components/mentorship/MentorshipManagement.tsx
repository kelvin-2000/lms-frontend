import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MentorshipProgram, MentorshipStatus } from '@/types/mentorship';
import {
  createMentorshipProgram,
  updateMentorshipProgram,
  deleteMentorshipProgram,
  MentorshipProgramCreateData,
} from '@/services/mentorshipService';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface MentorshipManagementProps {
  programs: MentorshipProgram[];
  onProgramsUpdated: () => void;
}

const MENTORSHIP_STATUSES: { value: MentorshipStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'draft', label: 'Draft' },
];

const MentorshipManagement: React.FC<MentorshipManagementProps> = ({
  programs,
  onProgramsUpdated,
}) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] =
    useState<MentorshipProgram | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [formData, setFormData] = useState<MentorshipProgramCreateData>({
    title: '',
    description: '',
    mentor_id: 0,
    duration: '',
    capacity: 5,
    status: 'open',
    category: '',
  });

  // Extract unique mentors from the program data
  const mentors = React.useMemo(() => {
    const uniqueMentors = new Map();

    programs.forEach((program) => {
      if (program.mentor && !uniqueMentors.has(program.mentor.id)) {
        uniqueMentors.set(program.mentor.id, program.mentor);
      }
    });

    return Array.from(uniqueMentors.values());
  }, [programs]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      // Handle special case for mentor_id which should be a number
      if (name === 'mentor_id') {
        return { ...prev, [name]: parseInt(value, 10) || 0 };
      }
      // Handle special case for capacity which should be a number
      else if (name === 'capacity') {
        return { ...prev, [name]: parseInt(value, 10) || 5 };
      }
      return { ...prev, [name]: value };
    });

    // Clear validation error for this field when it's changed
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      if (editingProgram) {
        await updateMentorshipProgram(editingProgram.id, formData);
        toast.success('Mentorship program updated successfully');
      } else {
        await createMentorshipProgram(formData);
        toast.success('Mentorship program created successfully');
      }
      setIsModalOpen(false);
      onProgramsUpdated();
    } catch (error) {
      console.error('Error saving mentorship program:', error);

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
        toast.error(`Failed to save mentorship program: ${errorMessage}`);
      }
    }
  };

  const handleDelete = async (programId: string | number) => {
    if (
      window.confirm('Are you sure you want to delete this mentorship program?')
    ) {
      try {
        await deleteMentorshipProgram(programId);
        toast.success('Mentorship program deleted successfully');
        onProgramsUpdated();
      } catch (error) {
        toast.error('Failed to delete mentorship program');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Programs</h2>
        <button
          onClick={() => {
            setEditingProgram(null);
            setValidationErrors({});
            setFormData({
              title: '',
              description: '',
              mentor_id: 0,
              duration: '',
              capacity: 5,
              status: 'open',
              category: '',
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create New Program
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div key={program.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
              <span
                className={`text-sm px-2 py-1 rounded-full h-[30px] ${
                  program.status === 'open'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {program.status}
              </span>
            </div>
            <p className="text-gray-600 mb-2">
              {program.description.substring(0, 150)}...
            </p>
            <div className="flex items-center mt-4 mb-2">
              <Image
                src={program.mentor.avatar}
                alt={program.mentor.name}
                width={40}
                height={40}
                className="rounded-full mr-3 object-cover"
              />
              <div>
                <p className="text-gray-700 font-medium">
                  {program.mentor.name}
                </p>
                <p className="text-gray-500 text-sm">
                  {program.mentor.title || program.mentor.role}
                </p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-1">
              <span className="font-medium">Duration:</span> {program.duration}
            </p>
            <p className="text-gray-500 text-sm mb-4">
              <span className="font-medium">Capacity:</span> {program.capacity}{' '}
              mentees
            </p>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setEditingProgram(program);
                  setValidationErrors({});
                  setFormData({
                    title: program.title,
                    description: program.description,
                    mentor_id: program.mentor_id,
                    duration: program.duration,
                    capacity: program.capacity,
                    status: program.status as MentorshipStatus,
                    category: program.category || '',
                  });
                  setIsModalOpen(true);
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(program.id)}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingProgram
                ? 'Edit Mentorship Program'
                : 'Create New Mentorship Program'}
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

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Title*
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description*
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.description
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.description[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mentor*
                  </label>
                  <select
                    name="mentor_id"
                    value={formData.mentor_id}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.mentor_id
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select a mentor</option>
                    {mentors.map((mentor) => (
                      <option key={mentor.id} value={mentor.id}>
                        {mentor.name}
                      </option>
                    ))}
                  </select>
                  {validationErrors.mentor_id && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.mentor_id[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration*
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. 3 months, 12 weeks"
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.duration
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.duration && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.duration[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Capacity*
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min={1}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.capacity
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.capacity && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.capacity[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status*
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
                    required
                  >
                    {MENTORSHIP_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  {validationErrors.status && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.status[0]}
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
                      validationErrors.category
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  >
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile Development</option>
                    <option value="database">Database</option>
                    <option value="design">UI/UX Design</option>
                    <option value="career">Career Guidance</option>
                    <option value="other">Other</option>
                  </select>
                  {validationErrors.category && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.category[0]}
                    </p>
                  )}
                </div>
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
                  {editingProgram ? 'Update Program' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorshipManagement;
