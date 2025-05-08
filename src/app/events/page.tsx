'use client';

import React, { useEffect, useState } from 'react';
import EventCard from '@/components/events/EventCard';
import { Event } from '@/types/events';

interface ApiResponse {
  success: boolean;
  data: Event[];
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    search: '',
  });
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          ...(filters.type && { type: filters.type }),
          ...(filters.location && { location: filters.location }),
          ...(filters.search && { search: filters.search }),
        });

        const response = await fetch(
          `http://127.0.0.1:8000/api/events/upcoming?${queryParams}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data: ApiResponse = await response.json();
        setEvents(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filters.type, filters.location]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, search: value }));

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          ...(filters.type && { type: filters.type }),
          ...(filters.location && { location: filters.location }),
          ...(value && { search: value }),
        });

        const response = await fetch(
          `http://127.0.0.1:8000/api/events/upcoming?${queryParams}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data: ApiResponse = await response.json();
        setEvents(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms delay

    setSearchTimeout(timeout);
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Upcoming Events
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Join our webinars, workshops, and conferences to expand your
            knowledge and network with fellow professionals.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Event Types</option>
                <option value="webinar">Webinars</option>
                <option value="workshop">Workshops</option>
                <option value="conference">Conferences</option>
                <option value="bootcamp">Bootcamps</option>
                <option value="other">Other</option>
              </select>
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Locations</option>
                <option value="online">Online</option>
                <option value="in-person">In-Person</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="search"
                placeholder="Search events..."
                value={filters.search}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard
                key={event.id}
                {...event}
                thumbnailUrl={event?.thumbnail || event?.thumbnailUrl}
                type={event.type}
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 text-center">
              <p className="text-lg text-gray-600">
                No events found matching your criteria.
              </p>
              <p className="mt-2 text-md text-gray-500">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>

        {/* Calendar View Toggle */}
        <div className="mt-12 text-center hidden">
          <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            Switch to Calendar View
          </button>
        </div>
      </div>
    </div>
  );
}
