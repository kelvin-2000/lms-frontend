import api from './api';

export interface Mentor {
  id: number;
  name: string;
  avatar: string;
  title: string;
}

export interface MentorshipProgram {
  id: number;
  title: string;
  description: string;
  mentor_id: number;
  mentor?: Mentor;
  capacity: number;
  duration: number;
  requirements: string[];
  status: 'open' | 'closed' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface MentorshipFilters {
  category?: string;
  status?: string;
  duration?: string;
  search?: string;
}

export interface MentorshipApplication {
  id: number;
  user_id: number;
  program_id: number;
  status: 'pending' | 'accepted' | 'rejected';
  motivation: string;
  created_at: string;
  updated_at: string;
}

export interface MentorshipSession {
  id: number;
  program_id: number;
  mentor_id: number;
  mentee_id: number;
  scheduled_at: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  created_at: string;
  updated_at: string;
}

export class MentorshipService {
  // Public routes
  async getOpenPrograms(
    filters?: MentorshipFilters,
  ): Promise<MentorshipProgram[]> {
    // Only include non-empty filter parameters
    const queryParams: Record<string, string> = {};
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          queryParams[key] = value;
        }
      });
    }

    const response = await api.get<{
      success: boolean;
      data: MentorshipProgram[];
    }>('/mentorship-programs/open', {
      params: queryParams,
    });
    return response.data.data;
  }

  async getProgram(id: number): Promise<MentorshipProgram> {
    const response = await api.get<MentorshipProgram>(
      `/mentorship-programs/${id}`,
    );
    return response.data;
  }

  // Protected routes
  async createProgram(
    data: Omit<MentorshipProgram, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<MentorshipProgram> {
    const response = await api.post<MentorshipProgram>(
      '/mentorship-programs',
      data,
    );
    return response.data;
  }

  async updateProgram(
    id: number,
    data: Partial<MentorshipProgram>,
  ): Promise<MentorshipProgram> {
    const response = await api.put<MentorshipProgram>(
      `/mentorship-programs/${id}`,
      data,
    );
    return response.data;
  }

  async deleteProgram(id: number): Promise<void> {
    await api.delete(`/mentorship-programs/${id}`);
  }

  async getProgramApplications(
    programId: number,
  ): Promise<MentorshipApplication[]> {
    const response = await api.get<MentorshipApplication[]>(
      `/mentorship-programs/${programId}/applications`,
    );
    return response.data;
  }

  async getProgramSessions(programId: number): Promise<MentorshipSession[]> {
    const response = await api.get<MentorshipSession[]>(
      `/mentorship-programs/${programId}/sessions`,
    );
    return response.data;
  }

  async applyForProgram(
    programId: number,
    data: { motivation: string },
  ): Promise<MentorshipApplication> {
    const response = await api.post<MentorshipApplication>(
      `/mentorship-programs/${programId}/apply`,
      data,
    );
    return response.data;
  }

  async acceptApplication(
    applicationId: number,
  ): Promise<MentorshipApplication> {
    const response = await api.put<MentorshipApplication>(
      `/mentorship-applications/${applicationId}/accept`,
    );
    return response.data;
  }

  async rejectApplication(
    applicationId: number,
  ): Promise<MentorshipApplication> {
    const response = await api.put<MentorshipApplication>(
      `/mentorship-applications/${applicationId}/reject`,
    );
    return response.data;
  }

  async createSession(
    data: Omit<MentorshipSession, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<MentorshipSession> {
    const response = await api.post<MentorshipSession>(
      '/mentorship-sessions',
      data,
    );
    return response.data;
  }

  async completeSession(
    sessionId: number,
    notes: string,
  ): Promise<MentorshipSession> {
    const response = await api.put<MentorshipSession>(
      `/mentorship-sessions/${sessionId}/complete`,
      { notes },
    );
    return response.data;
  }

  async cancelSession(sessionId: number): Promise<MentorshipSession> {
    const response = await api.put<MentorshipSession>(
      `/mentorship-sessions/${sessionId}/cancel`,
    );
    return response.data;
  }
}

export default new MentorshipService();
