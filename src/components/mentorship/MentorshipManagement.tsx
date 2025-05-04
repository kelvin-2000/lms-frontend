import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MentorshipProgram } from '@/types/mentorship';
import {
  createMentorshipProgram,
  updateMentorshipProgram,
  deleteMentorshipProgram,
} from '@/services/mentorshipService';
import { toast } from 'react-hot-toast';

interface MentorshipManagementProps {
  programs: MentorshipProgram[];
  onProgramsUpdated: () => void;
}

const MentorshipManagement: React.FC<MentorshipManagementProps> = ({
  programs,
  onProgramsUpdated,
}) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] =
    useState<MentorshipProgram | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mentor: '',
    duration: '',
    requirements: '',
    benefits: '',
    applicationLink: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      toast.error('Failed to save mentorship program');
    }
  };

  const handleDelete = async (programId: string) => {
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
        <h2 className="text-2xl font-bold">Manage Mentorship Programs</h2>
        <button
          onClick={() => {
            setEditingProgram(null);
            setFormData({
              title: '',
              description: '',
              mentor: '',
              duration: '',
              requirements: '',
              benefits: '',
              applicationLink: '',
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
            <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
            <p className="text-gray-600 mb-2">{program.description}</p>
            <p className="text-gray-500 mb-2">Mentor: {program.mentor}</p>
            <p className="text-gray-500 mb-2">Duration: {program.duration}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingProgram(program);
                  setFormData({
                    title: program.title,
                    description: program.description,
                    mentor: program.mentor,
                    duration: program.duration,
                    requirements: program.requirements,
                    benefits: program.benefits,
                    applicationLink: program.applicationLink,
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingProgram
                ? 'Edit Mentorship Program'
                : 'Create New Mentorship Program'}
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
                    Mentor
                  </label>
                  <input
                    type="text"
                    value={formData.mentor}
                    onChange={(e) =>
                      setFormData({ ...formData, mentor: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
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
                    Benefits
                  </label>
                  <textarea
                    value={formData.benefits}
                    onChange={(e) =>
                      setFormData({ ...formData, benefits: e.target.value })
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
                  {editingProgram ? 'Update' : 'Create'}
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
