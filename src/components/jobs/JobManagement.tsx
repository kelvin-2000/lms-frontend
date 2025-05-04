import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Job } from '@/types/jobs';
import { createJob, updateJob, deleteJob } from '@/services/jobService';
import { toast } from 'react-hot-toast';

interface JobManagementProps {
  jobs: Job[];
  onJobsUpdated: () => void;
}

const JobManagement: React.FC<JobManagementProps> = ({
  jobs,
  onJobsUpdated,
}) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    type: 'full-time',
    salary: '',
    requirements: '',
    applicationLink: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast.error('Failed to save job opportunity');
    }
  };

  const handleDelete = async (jobId: string) => {
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
        <h2 className="text-2xl font-bold">Manage Job Opportunities</h2>
        <button
          onClick={() => {
            setEditingJob(null);
            setFormData({
              title: '',
              company: '',
              description: '',
              location: '',
              type: 'full-time',
              salary: '',
              requirements: '',
              applicationLink: '',
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
            <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
            <p className="text-gray-600 mb-2">{job.company}</p>
            <p className="text-gray-500 mb-2">Location: {job.location}</p>
            <p className="text-gray-500 mb-2">Type: {job.type}</p>
            <p className="text-gray-500 mb-2">Salary: {job.salary}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingJob(job);
                  setFormData({
                    title: job.title,
                    company: job.company,
                    description: job.description,
                    location: job.location,
                    type: job.type,
                    salary: job.salary,
                    requirements: job.requirements,
                    applicationLink: job.applicationLink,
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingJob
                ? 'Edit Job Opportunity'
                : 'Create New Job Opportunity'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Salary
                  </label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Requirements
                  </label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) =>
                      setFormData({ ...formData, requirements: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Application Link
                  </label>
                  <input
                    type="text"
                    value={formData.applicationLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        applicationLink: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  {editingJob ? 'Update' : 'Create'}
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
