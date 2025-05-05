export interface JobOpportunity {
  id: number;
  title: string;
  company: string;
  description: string;
  requirements: string;
  location: string;
  salary_range: string;
  job_type: string;
  work_location_type: string;
  experience_level: string;
  application_url: string;
  deadline: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type WorkLocationType = 'on-site' | 'remote' | 'hybrid';
export type ExperienceLevel = 'entry-level' | 'mid-level' | 'senior-level';
export type JobStatus = 'open' | 'closed' | 'draft';
