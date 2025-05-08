import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CourseCardProps {
  title: string;
  id: number | string;
  instructor: string;
  thumbnailUrl: string;
  level: string;
  duration: string;
  price: string;
  category: string;
}

const CourseCard = ({
  title,
  id,
  category,
  instructor,
  thumbnailUrl,
  level,
  duration,
  price,
}: CourseCardProps) => {
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
  
  const formatUnderscoreText = (text: string) => {
    return text
      ?.split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1" aria-labelledby={`course-${id}-title`}>
      <div className="relative h-48 w-full">
        <Image
          src={thumbnailUrl || '/assets/courses/default.jpg'}
          alt={`${title} course thumbnail`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="transition-transform duration-300 hover:scale-105 object-cover"
        />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span 
              className="text-xs font-semibold px-2 py-1 rounded-full capitalize bg-yellow-100 text-gray-800"
              aria-label={`Category: ${formatUnderscoreText(category)}`}
            >
              {formatUnderscoreText(category)}
            </span>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${getLevelColor(level)} capitalize`}
              aria-label={`Difficulty level: ${level}`}
            >
              {level}
            </span>
          </div>
          <span 
            className="text-sm text-gray-500"
            aria-label={`Course duration: ${duration}`}
          >
            {duration}
          </span>
        </div>
        
        <Link 
          href={`/courses/${id}`}
          aria-labelledby={`course-${id}-title`}
          className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md"
        >
          <h3 
            id={`course-${id}-title`}
            className="text-xl font-semibold mb-2 text-black hover:text-indigo-600 transition-colors"
          >
            {title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4">By <span className="font-medium">{instructor}</span></p>
        
        <div className="flex justify-between items-center">
          <span 
            className="font-bold text-lg text-black"
            aria-label={price === '0.00' ? 'Free course' : `Price: $${price}`}
          >
            {price === '0.00' ? 'Free' : `$${price}`}
          </span>
          <Link
            href={`/courses/${id}`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label={`View details for ${title} course`}
          >
            View Course
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;
