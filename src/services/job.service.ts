import { BaseService } from './base.service';
import api from './api';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  postedAt: string;
  deadline: string;
  applications: number;
  views: number;
  companyInfo: {
    name: string;
    logo: string;
    website: string;
    description: string;
    size: string;
    industry: string;
  };
}

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
}

export interface JobApplication {
  id: number;
  user_id: number;
  job_opportunity_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  cover_letter: string;
  resume_url: string;
  created_at: string;
  updated_at: string;
}

export class JobService extends BaseService {
  // Public routes
  async getJob(id: string): Promise<Job> {
    return this.get<Job>(`/jobs/${id}`);
  }

  async getJobs(): Promise<Job[]> {
    return this.get<Job[]>('/jobs');
  }

  async getOpenJobs(): Promise<JobOpportunity[]> {
    const response = await api.get<JobOpportunity[]>('/job-opportunities/open');
    return response.data;
  }

  async getJobApplications(jobId: number): Promise<JobApplication[]> {
    const response = await api.get<JobApplication[]>(
      `/job-opportunities/${jobId}/applications`,
    );
    return response.data;
  }

  async applyForJob(
    jobId: string,
    data: { resume: string; coverLetter: string },
  ): Promise<{ success: boolean; message: string }> {
    return this.post(`/jobs/${jobId}/apply`, data);
  }

  async searchJobs(query: string): Promise<Job[]> {
    return this.get<Job[]>(`/jobs/search?q=${query}`);
  }

  // Protected routes
  async createJob(
    data: Omit<JobOpportunity, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<JobOpportunity> {
    const response = await api.post<JobOpportunity>('/job-opportunities', data);
    return response.data;
  }

  async updateJob(
    id: number,
    data: Partial<JobOpportunity>,
  ): Promise<JobOpportunity> {
    const response = await api.put<JobOpportunity>(
      `/job-opportunities/${id}`,
      data,
    );
    return response.data;
  }

  async deleteJob(id: number): Promise<void> {
    await api.delete(`/job-opportunities/${id}`);
  }

  async updateApplicationStatus(
    applicationId: number,
    status: JobApplication['status'],
  ): Promise<JobApplication> {
    const response = await api.put<JobApplication>(
      `/job-applications/${applicationId}/status`,
      { status },
    );
    return response.data;
  }
}

export const jobService = new JobService();
