export interface JobOpportunity {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  salary_range: string;
  requirements: string[];
  deadline: string;
  created_at: string;
  updated_at: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  postedDate: string;
}
