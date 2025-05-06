import axios from 'axios';

export class BaseService {
  protected baseUrl: string;
  protected token: string | null;

  constructor() {
    this.baseUrl = 'http://127.0.0.1:8000/api';
    this.token = localStorage.getItem('token');
  }

  protected getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  protected async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Request failed');
      }
      throw error;
    }
  }

  protected async post<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await axios.post(`${this.baseUrl}${endpoint}`, data, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Request failed');
      }
      throw error;
    }
  }

  protected async put<T>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await axios.put(`${this.baseUrl}${endpoint}`, data, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Request failed');
      }
      throw error;
    }
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await axios.delete(`${this.baseUrl}${endpoint}`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Request failed');
      }
      throw error;
    }
  }
}
