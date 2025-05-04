import { useState, useEffect } from 'react';
import mentorshipService, {
  MentorshipProgram,
} from '@/services/mentorship.service';

export const useMentorship = () => {
  const [openPrograms, setOpenPrograms] = useState<MentorshipProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const programs = await mentorshipService.getOpenPrograms();
        setOpenPrograms(programs);
      } catch (err) {
        setError('Failed to fetch mentorship programs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return {
    openPrograms,
    loading,
    error,
  };
};
