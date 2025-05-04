'use client';
import React from 'react';
import MentorshipManagement from '@/components/mentorship/MentorshipManagement';
import { getMentorshipPrograms } from '@/services/mentorshipService';

const MentorshipPage = async () => {
  const programs = await getMentorshipPrograms();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Mentorship Programs</h1>
      <MentorshipManagement
        programs={programs}
        onProgramsUpdated={() => window.location.reload()}
      />
    </div>
  );
};

export default MentorshipPage;
