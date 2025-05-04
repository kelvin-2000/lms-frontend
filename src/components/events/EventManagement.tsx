import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/types/events';
import { createEvent, updateEvent, deleteEvent } from '@/services/eventService';
import { toast } from 'react-hot-toast';

interface EventManagementProps {
  events: Event[];
  onEventsUpdated: () => void;
}

const EventManagement: React.FC<EventManagementProps> = ({
  events,
  onEventsUpdated,
}) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    imageUrl: '',
    registrationLink: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, formData);
        toast.success('Event updated successfully');
      } else {
        await createEvent(formData);
        toast.success('Event created successfully');
      }
      setIsModalOpen(false);
      onEventsUpdated();
    } catch (error) {
      toast.error('Failed to save event');
    }
  };

  const handleDelete = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
        toast.success('Event deleted successfully');
        onEventsUpdated();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Events</h2>
        <button
          onClick={() => {
            setEditingEvent(null);
            setFormData({
              title: '',
              description: '',
              date: '',
              location: '',
              imageUrl: '',
              registrationLink: '',
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create New Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-2">{event.description}</p>
            <p className="text-gray-500 mb-2">
              Date: {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="text-gray-500 mb-4">Location: {event.location}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingEvent(event);
                  setFormData({
                    title: event.title,
                    description: event.description,
                    date: event.date,
                    location: event.location,
                    imageUrl: event.imageUrl,
                    registrationLink: event.registrationLink,
                  });
                  setIsModalOpen(true);
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event.id)}
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
              {editingEvent ? 'Edit Event' : 'Create New Event'}
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
                    Date
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
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
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Registration Link
                  </label>
                  <input
                    type="text"
                    value={formData.registrationLink}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registrationLink: e.target.value,
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
                  {editingEvent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
