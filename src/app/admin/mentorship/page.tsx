'use client';
import React, { useState, useEffect } from 'react';
import MentorshipManagement from '@/components/mentorship/MentorshipManagement';
import { getMentorshipPrograms } from '@/services/mentorshipService';
import { MentorshipProgram } from '@/types/mentorship';

const MentorshipPage = () => {
  const [programs, setPrograms] = useState<MentorshipProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  useEffect(() => {
    // Only run this effect in the browser
    if (!isBrowser) return;

    const fetchPrograms = async () => {
      try {
        const data = await getMentorshipPrograms();
        setPrograms(data);
      } catch (error) {
        console.error('Error fetching mentorship programs:', error);
        if (
          error instanceof Error &&
          error.message === 'Authentication required'
        ) {
          setError('Please log in to view and manage mentorship programs.');
        } else {
          setError(
            'Failed to load mentorship programs. Please try again later.',
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [isBrowser]);

  const handleProgramsUpdated = () => {
    if (!isBrowser) return;

    setLoading(true);
    getMentorshipPrograms()
      .then((data) => {
        setPrograms(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error refreshing mentorship programs:', error);
        setLoading(false);
      });
  };

  // Show a login message if not authenticated
  if (error && error.includes('Please log in')) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Manage Mentorship Programs</h1>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
          <p className="mb-4">{error}</p>
          <a
            href="/auth/login"
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold my-6 text-center">
        Manage Mentorship Programs
      </h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {loading && isBrowser ? (
        <div className="flex justify-center p-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent mb-4"></div>
            <p className="text-gray-500">Loading mentorship programs...</p>
          </div>
        </div>
      ) : (
        <MentorshipManagement
          programs={programs}
          onProgramsUpdated={handleProgramsUpdated}
        />
      )}
    </div>
  );
};

export default MentorshipPage;
