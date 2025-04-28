import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

// Types
type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';

interface JobBenefit {
  icon: string;
  title: string;
}

interface JobCompany {
  name: string;
  logo: string;
  website: string;
  about: string;
  location: string;
  employeesCount: string;
  industry: string;
}

interface JobDetails {
  id: string;
  title: string;
  company: JobCompany;
  location: string;
  locationType: 'remote' | 'onsite' | 'hybrid';
  salary: string;
  jobType: JobType;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: JobBenefit[];
  skills: string[];
  experienceLevel: 'entry' | 'mid' | 'senior';
  educationLevel: string;
  postedDate: Date;
  deadline: Date;
  applicationLink?: string;
  applicationEmail?: string;
}

// This is mock data that would normally come from an API call to the Laravel backend
const mockJobDetails: JobDetails = {
  id: '1',
  title: 'Frontend Developer',
  company: {
    name: 'TechCorp Inc.',
    logo: '/assets/companies/techcorp.png',
    website: 'https://techcorp.example.com',
    about: 'TechCorp is a leading technology company specializing in web and mobile application development. We work with clients across various industries to create innovative digital solutions that drive business growth.',
    location: 'New York, NY',
    employeesCount: '50-100',
    industry: 'Software Development',
  },
  location: 'New York, NY',
  locationType: 'hybrid',
  salary: '$80,000 - $100,000',
  jobType: 'full-time',
  description: 'We are looking for a skilled Frontend Developer to join our team. The ideal candidate will have strong experience with React, TypeScript, and modern frontend frameworks. You will be responsible for developing user interfaces for our web applications, collaborating with backend developers, and ensuring high-quality, responsive design implementation.',
  responsibilities: [
    'Develop responsive, cross-browser compatible user interfaces using React and TypeScript',
    'Collaborate with backend developers to integrate frontend components with API services',
    'Implement and maintain frontend testing using Jest and React Testing Library',
    'Optimize web applications for maximum speed and scalability',
    'Stay up-to-date with emerging trends and best practices in frontend development',
    'Participate in code reviews and contribute to team knowledge sharing',
  ],
  requirements: [
    'Bachelor\'s degree in Computer Science or related field (or equivalent practical experience)',
    'At least 3 years of experience with React and modern JavaScript',
    'Strong knowledge of HTML5, CSS3, and responsive design principles',
    'Experience with TypeScript and state management libraries (Redux, Context API)',
    'Familiarity with version control systems, particularly Git',
    'Understanding of CI/CD pipelines and automated testing',
    'Excellent problem-solving skills and attention to detail',
    'Good communication skills and ability to work in a team environment',
  ],
  benefits: [
    { icon: 'health', title: 'Health Insurance' },
    { icon: 'dental', title: 'Dental & Vision Coverage' },
    { icon: 'retirement', title: '401(k) Matching' },
    { icon: 'vacation', title: '4 Weeks Paid Vacation' },
    { icon: 'remote', title: 'Remote Work Options' },
    { icon: 'education', title: 'Professional Development Budget' },
    { icon: 'gym', title: 'Gym Membership' },
    { icon: 'snacks', title: 'Free Snacks & Beverages' },
  ],
  skills: [
    'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'SASS', 'Redux', 'Jest', 'Git', 'Responsive Design',
  ],
  experienceLevel: 'mid',
  educationLevel: 'Bachelor\'s',
  postedDate: new Date('2023-12-01'),
  deadline: new Date('2024-01-15'),
  applicationEmail: 'careers@techcorp.example.com',
};

export default function JobDetailPage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch the job data using the ID from params
  const job = mockJobDetails;
  
  // Calculate days left
  const today = new Date();
  const daysLeft = Math.ceil((job.deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case 'remote':
        return (
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'onsite':
        return (
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'hybrid':
        return (
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };
  
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
    <div className="bg-gray-50">
      {/* Header section with job info */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                <Image
                  src={job.company.logo}
                  alt={job.company.name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <div className="flex items-center mt-1">
                  <span className="text-gray-500">{job.company.name}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-gray-500">{job.location}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.jobType)} capitalize`}>
                {job.jobType}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 flex items-center">
                {getLocationTypeIcon(job.locationType)}
                <span className="ml-1 capitalize">{job.locationType}</span>
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {job.experienceLevel === 'entry' ? 'Entry Level' : job.experienceLevel === 'mid' ? 'Mid Level' : 'Senior Level'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Job content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
                <div className="flex items-center space-x-4 text-sm">
                  <button className="flex items-center text-gray-500 hover:text-gray-700">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                  <button className="flex items-center text-gray-500 hover:text-gray-700">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Save
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Salary Range</h3>
                  <p className="text-gray-900 font-medium">{job.salary}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Job Type</h3>
                  <p className="text-gray-900 font-medium capitalize">{job.jobType}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Experience Level</h3>
                  <p className="text-gray-900 font-medium">
                    {job.experienceLevel === 'entry' ? 'Entry Level' : job.experienceLevel === 'mid' ? 'Mid Level' : 'Senior Level'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Education Level</h3>
                  <p className="text-gray-900 font-medium">{job.educationLevel}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Job Description</h3>
                <p className="text-gray-700">{job.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Responsibilities</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {job.responsibilities.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Requirements</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {job.requirements.map((item, index) => (
                    <li key={index} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Benefits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {job.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{benefit.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About {job.company.name}</h2>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                  <Image
                    src={job.company.logo}
                    alt={job.company.name}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{job.company.name}</h3>
                  <p className="text-gray-500 text-sm">{job.company.industry} • {job.company.employeesCount} employees</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{job.company.about}</p>
              <a 
                href={job.company.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center"
              >
                Visit company website
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Right column - Apply */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Apply for this Job</h3>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Posted on</span>
                  <span className="text-gray-900">{format(job.postedDate, 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Application deadline</span>
                  <span className="text-gray-900">{format(job.deadline, 'MMMM d, yyyy')}</span>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-center">
                  <span className="text-yellow-800 font-medium">{daysLeft} days left</span> to apply
                </div>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full-name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume/CV
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="cover-letter" className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    id="cover-letter"
                    rows={4}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Tell us why you're a good fit for this position..."
                  />
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Apply Now
                  </button>
                </div>
              </form>
              
              {job.applicationEmail && (
                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>Or email your resume directly to:</p>
                  <a href={`mailto:${job.applicationEmail}`} className="text-indigo-600 font-medium hover:text-indigo-800">
                    {job.applicationEmail}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 