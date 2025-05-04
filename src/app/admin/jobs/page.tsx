'use client';
import React from 'react';
import JobManagement from '@/components/jobs/JobManagement';
import { getJobs } from '@/services/jobService';

const JobsPage = async () => {
  const jobs = await getJobs();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Job Opportunities</h1>
      <JobManagement
        jobs={jobs}
        onJobsUpdated={() => window.location.reload()}
      />
    </div>
  );
};

export default JobsPage;
