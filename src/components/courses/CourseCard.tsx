import Link from 'next/link';
import Image from 'next/image';

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  thumbnailUrl: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  price: number | 'Free';
}

const CourseCard = ({ id, title, instructor, thumbnailUrl, level, duration, price }: CourseCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 w-full">
        <Image
          src={thumbnailUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getLevelColor(level)} capitalize`}>
            {level}
          </span>
          <span className="text-sm text-gray-500">{duration}</span>
        </div>
        <Link href={`/courses/${id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-indigo-600 transition-colors">{title}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4">By {instructor}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">
            {typeof price === 'number' ? `$${price.toFixed(2)}` : price}
          </span>
          <Link 
            href={`/courses/${id}`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard; 