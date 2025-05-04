import { useState, useEffect } from 'react';
import jobService, { JobOpportunity } from '@/services/job.service';

export const useJobs = () => {
  const [openJobs, setOpenJobs] = useState<JobOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const jobs = await jobService.getOpenJobs();
        setOpenJobs(jobs);
      } catch (err) {
        setError('Failed to fetch jobs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return {
    openJobs,
    loading,
    error,
  };
};
