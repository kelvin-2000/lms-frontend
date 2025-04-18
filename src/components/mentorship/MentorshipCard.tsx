import Link from 'next/link';
import Image from 'next/image';

interface MentorshipCardProps {
  id: string;
  title: string;
  description: string;
  mentorName: string;
  mentorAvatar: string;
  mentorTitle: string;
  duration: string;
  capacity: number;
  status: 'open' | 'closed' | 'completed';
}

const MentorshipCard = ({
  id,
  title,
  description,
  mentorName,
  mentorAvatar,
  mentorTitle,
  duration,
  capacity,
  status
}: MentorshipCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)} capitalize`}>
            {status}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-6 line-clamp-3">{description}</p>
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-gray-600 text-sm">{duration}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span className="text-gray-600 text-sm">{capacity} spots</span>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center">
            <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
              <Image
                src={mentorAvatar}
                alt={mentorName}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">{mentorName}</h4>
              <p className="text-xs text-gray-500">{mentorTitle}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Link
            href={`/mentorship/${id}`}
            className="w-full block text-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {status === 'open' ? 'Apply Now' : 'View Details'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MentorshipCard; 