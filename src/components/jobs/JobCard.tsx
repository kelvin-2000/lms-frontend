import Link from 'next/link';
import { format } from 'date-fns';

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  deadline: Date;
  postedDate: Date;
}

const JobCard = ({
  id,
  title,
  company,
  location,
  salary,
  jobType,
  deadline,
  postedDate,
}: JobCardProps) => {
  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-blue-100 text-blue-800';
      case 'part-time':
        return 'bg-green-100 text-green-800';
      case 'contract':
        return 'bg-orange-100 text-orange-800';
      case 'internship':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Link href={`/jobs/${id}`}>
            <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
              {title}
            </h3>
          </Link>
          <p className="text-gray-600 mt-1">{company}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(jobType)} capitalize`}
        >
          {jobType}
        </span>
      </div>

      <div className="flex flex-wrap gap-y-2 mb-4">
        <div className="flex items-center mr-6">
          <svg
            className="w-5 h-5 text-gray-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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
          <span className="text-gray-600 text-sm">{location}</span>
        </div>
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-gray-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span className="text-gray-600 text-sm">{salary}</span>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <span>Posted: {format(postedDate, 'MMM dd, yyyy')}</span>
        <span>Deadline: {format(deadline, 'MMM dd, yyyy')}</span>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xs text-gray-500">
            {Math.ceil(
              (deadline.getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24),
            )}{' '}
            days left to apply
          </span>
        </div>
        <Link
          href={`/jobs/${id}`}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
