import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { EventType } from '@/types/events';

interface EventCardProps {
  id: string | number;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  location: string;
  thumbnailUrl: string;
  type: EventType | string;
}

const EventCard = ({
  title,
  id,
  description,
  start_date,
  end_date,
  location,
  thumbnailUrl,
  type,
}: EventCardProps) => {
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM dd, yyyy • h:mm a');
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'webinar':
        return 'bg-blue-100 text-blue-800';
      case 'workshop':
        return 'bg-green-100 text-green-800';
      case 'conference':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formattedStartDate = formatDate(start_date);
  const formattedEndDate = end_date ? formatDate(end_date) : null;
  const dateRangeText = end_date
    ? `${formattedStartDate} to ${formattedEndDate}`
    : formattedStartDate;

  return (
    <article
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
      aria-labelledby={`event-${id}-title`}
    >
      <div className="relative h-48 w-full">
        <Image
          src={thumbnailUrl || '/assets/events/default.jpg'}
          alt={`${title} event thumbnail`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="transition-transform duration-300 hover:scale-105 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${getEventTypeColor(type)} capitalize`}
            aria-label={`Event type: ${type}`}
          >
            {type}
          </span>
        </div>
      </div>
      <div className="p-5">
        <Link
          href={`/events/${id}`}
          aria-labelledby={`event-${id}-title`}
          className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md"
        >
          <h3
            id={`event-${id}-title`}
            className="text-xl font-semibold mb-2 text-black hover:text-indigo-600 transition-colors"
          >
            {title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="mb-4">
          <div className="flex items-start mb-2">
            <svg
              className="w-5 h-5 text-gray-500 mr-2 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <div>
              <p
                className="text-sm text-gray-700"
                aria-label={`Event date: ${dateRangeText}`}
              >
                {formattedStartDate}
                {formattedEndDate && <span> to {formattedEndDate}</span>}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-gray-500 mr-2 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <p
              className="text-sm text-gray-700"
              aria-label={`Event location: ${location}`}
            >
              {location}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href={`/events/${id}`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label={`View details for ${title} event`}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
