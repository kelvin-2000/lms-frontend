import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/types/events';
import { createEvent, updateEvent, deleteEvent } from '@/services/eventService';
import { toast } from 'react-hot-toast';

interface EventManagementProps {
  events: Event[];
  onEventsUpdated: () => void;
}

const EVENT_TYPES = [
  { value: 'webinar', label: 'Webinar' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'conference', label: 'Conference' },
  { value: 'other', label: 'Other' },
];

const EVENT_STATUSES = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'past', label: 'Past' },
];

const EventManagement: React.FC<EventManagementProps> = ({
  events,
  onEventsUpdated,
}) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    thumbnail: '/assets/event.jpg',
    max_participants: '100',
    type: 'webinar',
    status: 'upcoming',
    registrationLink: '',
  });

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
      // Format the data for submission
      const submissionData = {
        title: formData.title,
        description: formData.description,
        start_date: formData.start_date,
        end_date: formData.end_date,
        location: formData.location,
        max_participants: parseInt(formData.max_participants, 10),
        thumbnail: formData.thumbnail,
        type: formData.type,
        status: formData.status,
      };

      if (editingEvent) {
        await updateEvent(editingEvent.id, submissionData);
        toast.success('Event updated successfully');
      } else {
        await createEvent(submissionData);
        toast.success('Event created successfully');
      }
      setIsModalOpen(false);
      onEventsUpdated();
    } catch (error) {
      console.error('Error saving event:', error);

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
        toast.error(`Failed to save event: ${errorMessage}`);
      }
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

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    // Format to YYYY-MM-DDThh:mm
    return date.toISOString().slice(0, 16);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Existing Events</h2>
        <button
          onClick={() => {
            setEditingEvent(null);
            setValidationErrors({});
            setFormData({
              title: '',
              description: '',
              start_date: '',
              end_date: '',
              location: '',
              thumbnail: '/assets/event.jpg',
              max_participants: '100',
              type: 'webinar',
              status: 'upcoming',
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
              Start: {new Date(event.start_date).toLocaleString()}
            </p>
            <p className="text-gray-500 mb-2">
              End: {new Date(event.end_date).toLocaleString()}
            </p>
            <p className="text-gray-500 mb-4">Location: {event.location}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditingEvent(event);
                  setValidationErrors({});
                  setFormData({
                    title: event.title,
                    description: event.description,
                    start_date: formatDateForInput(event.start_date),
                    end_date: formatDateForInput(event.end_date),
                    location: event.location,
                    thumbnail: event.thumbnailUrl || '/assets/event.jpg',
                    max_participants: String(event.max_participants || 100),
                    type: event.type || 'webinar',
                    status: event.status || 'upcoming',
                    registrationLink: '',
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
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
              <div className="space-y-4">
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
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.description
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                    rows={3}
                  />
                  {validationErrors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.description[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.start_date
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.start_date && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.start_date[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.end_date
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.end_date && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.end_date[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
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
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.type
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    required
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {validationErrors.type && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.type[0]}
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
                    required
                  >
                    {EVENT_STATUSES.map((status) => (
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
                    Max Participants
                  </label>
                  <input
                    type="number"
                    name="max_participants"
                    value={formData.max_participants}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.max_participants
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    min="1"
                  />
                  {validationErrors.max_participants && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.max_participants[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image URL
                  </label>
                  <input
                    type="text"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                      validationErrors.thumbnail
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.thumbnail && (
                    <p className="mt-1 text-sm text-red-600">
                      {validationErrors.thumbnail[0]}
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
                  {editingEvent ? 'Update Event' : 'Create Event'}
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
