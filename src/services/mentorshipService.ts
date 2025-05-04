import axios from 'axios';
import { MentorshipProgram } from '@/types/mentorship';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createMentorshipProgram = async (
  programData: Omit<MentorshipProgram, 'id'>,
) => {
  const response = await axios.post(
    `${API_URL}/mentorship-programs`,
    programData,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

export const updateMentorshipProgram = async (
  programId: string,
  programData: Partial<MentorshipProgram>,
) => {
  const response = await axios.put(
    `${API_URL}/mentorship-programs/${programId}`,
    programData,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

export const deleteMentorshipProgram = async (programId: string) => {
  const response = await axios.delete(
    `${API_URL}/mentorship-programs/${programId}`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};

export const getMentorshipPrograms = async () => {
  const response = await axios.get(`${API_URL}/mentorship-programs`, {
    withCredentials: true,
  });
  return response.data;
};

export const getMentorshipProgramById = async (programId: string) => {
  const response = await axios.get(
    `${API_URL}/mentorship-programs/${programId}`,
    {
      withCredentials: true,
    },
  );
  return response.data;
};
