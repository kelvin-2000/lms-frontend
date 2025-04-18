import JobCard from '@/components/jobs/JobCard';

// Define types for our mock data
type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';

interface MockJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  jobType: JobType;
  deadline: Date;
  postedDate: Date;
}

// This would normally come from an API call to the Laravel backend
const mockJobs: MockJob[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'New York, NY',
    salary: '$80,000 - $100,000',
    jobType: 'full-time',
    deadline: new Date('2024-01-15'),
    postedDate: new Date('2023-12-01'),
  },
  {
    id: '2',
    title: 'Laravel Backend Developer',
    company: 'WebSolutions Co.',
    location: 'Remote',
    salary: '$70,000 - $90,000',
    jobType: 'full-time',
    deadline: new Date('2024-01-20'),
    postedDate: new Date('2023-12-05'),
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    location: 'San Francisco, CA',
    salary: '$60,000 - $80,000',
    jobType: 'full-time',
    deadline: new Date('2024-01-10'),
    postedDate: new Date('2023-11-25'),
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'Cloud Systems Ltd.',
    location: 'Remote',
    salary: '$90,000 - $120,000',
    jobType: 'full-time',
    deadline: new Date('2024-01-30'),
    postedDate: new Date('2023-12-10'),
  },
  {
    id: '5',
    title: 'Web Development Intern',
    company: 'TechCorp Inc.',
    location: 'New York, NY',
    salary: '$20 - $25 per hour',
    jobType: 'internship',
    deadline: new Date('2024-01-05'),
    postedDate: new Date('2023-11-20'),
  },
  {
    id: '6',
    title: 'Mobile App Developer',
    company: 'AppWorks',
    location: 'Austin, TX',
    salary: '$75,000 - $95,000',
    jobType: 'full-time',
    deadline: new Date('2024-02-15'),
    postedDate: new Date('2023-12-15'),
  },
  {
    id: '7',
    title: 'Technical Writer',
    company: 'DocuTech',
    location: 'Remote',
    salary: '$40 - $50 per hour',
    jobType: 'contract',
    deadline: new Date('2024-01-25'),
    postedDate: new Date('2023-12-08'),
  },
  {
    id: '8',
    title: 'Database Administrator',
    company: 'DataSystems Co.',
    location: 'Chicago, IL',
    salary: '$85,000 - $110,000',
    jobType: 'full-time',
    deadline: new Date('2024-02-10'),
    postedDate: new Date('2023-12-12'),
  },
];

export default function JobsPage() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Job Opportunities</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Discover career opportunities that match your skills and aspirations in tech, development, and design.
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">All Job Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">All Locations</option>
                <option value="remote">Remote</option>
                <option value="new-york">New York, NY</option>
                <option value="san-francisco">San Francisco, CA</option>
                <option value="chicago">Chicago, IL</option>
                <option value="austin">Austin, TX</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Experience Level</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search jobs..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {mockJobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <a href="#" className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Previous
            </a>
            <a href="#" className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-indigo-600 hover:bg-gray-50">
              1
            </a>
            <a href="#" className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              2
            </a>
            <a href="#" className="px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              3
            </a>
            <a href="#" className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Next
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
} 