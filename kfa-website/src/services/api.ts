import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: async (data: { name: string; email: string; password: string; password_confirmation: string }) => {
    const response = await api.post('/register', data);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  getUser: async () => {
    const response = await api.get('/user');
    return response.data;
  },
};

// Members API
export const membersAPI = {
  getAll: async (params?: { page?: number; search?: string; type?: string; status?: string; per_page?: number }) => {
    const response = await api.get('/members', { params });
    return response.data;
  },

  getById: async (id: string | number) => {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/members', data);
    return response.data;
  },

  update: async (id: string | number, data: any) => {
    const response = await api.put(`/members/${id}`, data);
    return response.data;
  },

  delete: async (id: string | number) => {
    const response = await api.delete(`/members/${id}`);
    return response.data;
  },
};

// News API - использует новый NewsService с полной функциональностью
export { NewsService as newsAPI } from './api/news';

// Event Registration Types
export interface EventRegistration {
  id: number;
  event_id: number;
  user_id: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'attended';
  attendance_status?: 'present' | 'absent';
  cpe_hours?: number;
  certificate_url?: string;
  notes?: string;
  dietary_requirements?: string;
  special_needs?: string;
  created_at: string;
  updated_at: string;
  event?: any; // Event details if included
  user?: any; // User details if included
}

export interface EventRegistrationData {
  notes?: string;
  dietary_requirements?: string;
  special_needs?: string;
}

// Events API
export const eventsAPI = {
  getAll: async (params?: { page?: number; search?: string; status?: string; type?: string; per_page?: number }) => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  getById: async (id: string | number) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/events', data);
    return response.data;
  },

  update: async (id: string | number, data: any) => {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },

  delete: async (id: string | number) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Event Registration Methods
  register: async (eventId: string | number, data?: EventRegistrationData) => {
    const response = await api.post(`/events/${eventId}/register`, data || {});
    return response.data;
  },

  getMyRegistrations: async () => {
    const response = await api.get('/my-event-registrations');
    return response.data;
  },

  cancelRegistration: async (registrationId: number) => {
    const response = await api.post(`/event-registrations/${registrationId}/cancel`);
    return response.data;
  },

  getUpcoming: async () => {
    const response = await api.get('/events/upcoming');
    return response.data;
  },

  getFeatured: async () => {
    const response = await api.get('/events/featured');
    return response.data;
  },
};

// Programs API
export const programsAPI = {
  getAll: async () => {
    const response = await api.get('/programs');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/programs/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/programs', data);
    return response.data;
  },

  update: async (id: number, data: any) => {
    const response = await api.put(`/programs/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/programs/${id}`);
    return response.data;
  },
};

// Media API
export const mediaAPI = {
  getAll: async (params?: { type?: string; collection?: string; search?: string; per_page?: number }) => {
    const response = await api.get('/media', { params });
    return response.data;
  },

  getById: async (id: string | number) => {
    const response = await api.get(`/media/${id}`);
    return response.data;
  },

  upload: async (file: File, collection?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (collection) {
      formData.append('collection', collection);
    }

    const response = await api.post('/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string | number, data: { filename?: string; alt_text?: string; description?: string }) => {
    const response = await api.put(`/media/${id}`, data);
    return response.data;
  },

  delete: async (id: string | number) => {
    const response = await api.delete(`/media/${id}`);
    return response.data;
  },
};

// Partners API
export const partnersAPI = {
  getAll: async (params?: { status?: string; category?: string; featured?: boolean; search?: string; per_page?: number }) => {
    const response = await api.get('/partners', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/partners/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    email?: string;
    phone?: string;
    category: 'platinum' | 'gold' | 'silver' | 'bronze' | 'other';
    status: 'active' | 'inactive';
    is_featured?: boolean;
    display_order?: number;
    social_links?: Record<string, string>;
  }) => {
    const response = await api.post('/partners', data);
    return response.data;
  },

  update: async (id: number, data: Partial<{
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    email?: string;
    phone?: string;
    category: 'platinum' | 'gold' | 'silver' | 'bronze' | 'other';
    status: 'active' | 'inactive';
    is_featured?: boolean;
    display_order?: number;
    social_links?: Record<string, string>;
  }>) => {
    const response = await api.put(`/partners/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`/partners/${id}`);
    return response.data;
  },
};

// Settings API
export const settingsAPI = {
  getAll: async (category?: string) => {
    const params = category ? { category } : undefined;
    const response = await api.get('/settings', { params });
    return response.data;
  },

  getPublic: async () => {
    const response = await api.get('/settings/public');
    return response.data;
  },

  update: async (settings: Array<{ key: string; value: any }>) => {
    const response = await api.put('/settings', { settings });
    return response.data;
  },
};

// Membership Applications API
export interface MembershipApplicationData {
  membershipType: 'individual' | 'corporate';
  firstName: string;
  lastName: string;
  organizationName?: string;
  position: string;
  email: string;
  phone: string;
  experience: string;
  motivation: string;
  agreeToTerms: boolean;
}

export const applicationsAPI = {
  submit: async (data: MembershipApplicationData) => {
    const response = await api.post('/applications', data);
    return response.data;
  },
};
