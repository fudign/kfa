// Global TypeScript types for KFA Website

export interface Member {
  id: string | number;
  name: string;
  logo: string;
  type: 'broker' | 'dealer' | 'manager' | 'exchange' | 'depository';
  joinDate: string;
  website: string;
  licenseNumber: string;
  description?: string;
  email?: string;
  company?: string;
  position?: string;
  phone?: string;
  photo?: string;
  bio?: string;
  joined_at?: string;
}

export interface Event {
  id: string | number;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'conference' | 'seminar' | 'webinar' | 'workshop' | 'networking';
  registrationOpen: boolean;
  capacity?: number;
  registeredCount?: number;
  slug?: string;
  starts_at?: string;
  ends_at?: string;
  image?: string;
}

export interface NewsItem {
  id: string | number;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
  category: string;
  image?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles: string[];
  permissions: string[];
  is_super_admin: boolean;
  is_admin: boolean;
  is_moderator: boolean;
  is_editor: boolean;
  is_member: boolean;
  role?: 'admin' | 'member' | 'user' | 'guest';  // Для обратной совместимости
}

export interface Media {
  id: number;
  filename: string;
  path: string;
  disk: string;
  mime_type: string;
  size: number;
  human_size: string;
  width: number | null;
  height: number | null;
  metadata: {
    thumbnails?: Record<string, string>;
    collection?: string;
  } | null;
  url: string;
  thumbnail_url: string | null;
  is_image: boolean;
  is_pdf: boolean;
  is_document: boolean;
  uploader?: Partial<User>;
  uploaded_by: number;
  created_at: string;
  updated_at: string;
  alt_text?: string;
  description?: string;
}

export interface Partner {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  category: 'platinum' | 'gold' | 'silver' | 'bronze' | 'other';
  category_label: string;
  status: 'active' | 'inactive';
  status_label: string;
  is_featured: boolean;
  display_order: number;
  social_links: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: number;
  key: string;
  value: string | number | boolean | null;
  type: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  is_public: boolean;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export type Locale = 'ru' | 'ky' | 'en';

// Re-export news types
export * from './news';
