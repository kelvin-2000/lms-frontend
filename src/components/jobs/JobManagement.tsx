import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Job,
  JobCreateData,
  updateJob,
  deleteJob,
  createJob,
} from '@/services/jobService';
import {
  JobType,
  WorkLocationType,
  ExperienceLevel,
  JobStatus,
} from '@/types/jobs';
import { toast } from 'react-hot-toast';

interface JobManagementProps {
  jobs: Job[];
  onJobsUpdated: () => void;
  currentPage: number;
  totalPages: number;
  // eslint-disable-next-line no-unused-vars
  onPageChange: (page: number) => void;
}

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

const WORK_LOCATION_TYPES: { value: WorkLocationType; label: string }[] = [
  { value: 'on-site', label: 'On-site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
];

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'entry-level', label: 'Entry Level' },
  { value: 'mid-level', label: 'Mid Level' },
  { value: 'senior-level', label: 'Senior Level' },
];

const JOB_STATUSES: { value: JobStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'draft', label: 'Draft' },
];

const JobManagement: React.FC<JobManagementProps> = ({
  jobs,
  onJobsUpdated,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [formData, setFormData] = useState<JobCreateData>({
    title: '',
    company: '',
    description: '',
    requirements: '',
    location: '',
    salary_range: '',
    job_type: 'full-time',
    work_location_type: 'on-site',
    experience_level: 'mid-level',
    application_url: '',
    deadline: '',
    status: 'open',
  });

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    // Format to YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    try {
      if (editingJob) {
        await updateJob(editingJob.id, formData);
        toast.success('Job opportunity updated successfully');
      } else {
        await createJob(formData);
        toast.success('Job opportunity created successfully');
      }
      setIsModalOpen(false);
      onJobsUpdated();
    } catch (error) {
      console.error('Error saving job opportunity:', error);

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
        toast.error(`Failed to save job opportunity: ${errorMessage}`);
      }
    }
  };

  const handleDelete = async (jobId: string | number) => {
    if (
      window.confirm('Are you sure you want to delete this job opportunity?')
    ) {
      try {
        await deleteJob(jobId);
        toast.success('Job opportunity deleted successfully');
        onJobsUpdated();
      } catch (error) {
        toast.error('Failed to delete job opportunity');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Jobs</h2>
        <button
          onClick={() => {
            setEditingJob(null);
            setValidationErrors({});
            setFormData({
              title: '',
              company: '',
              description: '',
              requirements: '',
              location: '',
              salary_range: '',
              job_type: 'full-time',
              work_location_type: 'on-site',
              experience_level: 'mid-level',
              application_url: '',
              deadline: '',
              status: 'open',
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
              <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full">
                {job.status}
              </span>
            </div>
            <p className="text-gray-600 font-medium mb-2">{job.company}</p>
            <p className="text-gray-500 mb-1 text-sm">
              <span className="font-medium">Location:</span> {job.location} (
              {job.work_location_type})
            </p>
            <p className="text-gray-500 mb-1 text-sm">
              <span className="font-medium">Type:</span> {job.job_type} (
              {job.experience_level})
            </p>
            <p className="text-gray-500 mb-1 text-sm">
              <span className="font-medium">Salary:</span> {job.salary_range}
            </p>
            <p className="text-gray-500 mb-3 text-sm">
              <span className="font-medium">Deadline:</span>{' '}
              {new Date(job.deadline).toLocaleDateString()}
            </p>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                {job.description.substring(0, 100)}...
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setEditingJob(job);
                  setValidationErrors({});
                  setFormData({
                    title: job.title,
                    company: job.company,
                    description: job.description,
                    requirements: job.requirements,
                    location: job.location,
                    salary_range: job.salary_range,
                    job_type: job.job_type as JobType,
                    work_location_type:
                      job.work_location_type as WorkLocationType,
                    experience_level: job.experience_level as ExperienceLevel,
                    application_url: job.application_url,
                    deadline: formatDateForInput(job.deadline),
                    status: job.status as JobStatus,
                  });
                  setIsModalOpen(true);
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(job.id)}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-md ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingJob
                ? 'Edit Job Opportunity'
                : 'Create New Job Opportunity'}
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
                <div>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company*
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.company
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.company && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.company[0]}
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
                    rows={3}
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Requirements*
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows={3}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.requirements
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.requirements && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.requirements[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location*
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.location
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.location[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Salary Range*
                  </label>
                  <input
                    type="text"
                    name="salary_range"
                    value={formData.salary_range}
                    onChange={handleChange}
                    placeholder="e.g. $50,000 - $70,000"
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.salary_range
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.salary_range && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.salary_range[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Type*
                  </label>
                  <select
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.job_type
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  >
                    {JOB_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {validationErrors.job_type && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.job_type[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Work Location Type*
                  </label>
                  <select
                    name="work_location_type"
                    value={formData.work_location_type}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.work_location_type
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  >
                    {WORK_LOCATION_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {validationErrors.work_location_type && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.work_location_type[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Experience Level*
                  </label>
                  <select
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.experience_level
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  >
                    {EXPERIENCE_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  {validationErrors.experience_level && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.experience_level[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Application URL*
                  </label>
                  <input
                    type="url"
                    name="application_url"
                    value={formData.application_url}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.application_url
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/apply"
                    required
                  />
                  {validationErrors.application_url && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.application_url[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Application Deadline*
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.deadline
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.deadline && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.deadline[0]}
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
                    {JOB_STATUSES.map((status) => (
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
                  {editingJob ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
