import axios from 'axios';
import { Job } from '@/types/jobs';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createJob = async (jobData: Omit<Job, 'id'>) => {
  const response = await axios.post(`${API_URL}/jobs`, jobData, {
    withCredentials: true,
  });
  return response.data;
};

export const updateJob = async (jobId: string, jobData: Partial<Job>) => {
  const response = await axios.put(`${API_URL}/jobs/${jobId}`, jobData, {
    withCredentials: true,
  });
  return response.data;
};

export const deleteJob = async (jobId: string) => {
  const response = await axios.delete(`${API_URL}/jobs/${jobId}`, {
    withCredentials: true,
  });
  return response.data;
};

export const getJobs = async () => {
  const response = await axios.get(`${API_URL}/jobs`, {
    withCredentials: true,
  });
  return response.data;
};

export const getJobById = async (jobId: string) => {
  const response = await axios.get(`${API_URL}/jobs/${jobId}`, {
    withCredentials: true,
  });
  return response.data;
};
