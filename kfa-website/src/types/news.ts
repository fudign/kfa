import { Media } from './media';
import { User } from './auth';

export type NewsStatus =
  | 'draft'
  | 'submitted'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'unpublished'
  | 'archived';

export interface News {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string; // Устаревшее поле
  status: NewsStatus;
  featured: boolean;
  reading_time: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
  featured_image?: Media;
  gallery?: Media[];
  is_published: boolean;
  is_draft: boolean;
  is_pending: boolean;
  can_edit: boolean;
}

export interface NewsFormData {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  status: NewsStatus;
  featured: boolean;
  published_at?: Date | string | null;
  featured_image_id?: number | null;
  gallery_ids?: number[];
}

export interface NewsFilters {
  status?: NewsStatus;
  author_id?: number;
  featured?: boolean;
  search?: string;
  from_date?: string;
  to_date?: string;
  sort_by?: 'published_at' | 'created_at' | 'title' | 'status';
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface NewsStats {
  total: number;
  published: number;
  draft: number;
  pending: number;
  featured: number;
  archived: number;
}

export interface PaginatedNewsResponse {
  data: News[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Helper функции для работы со статусами
export const newsStatusLabels: Record<NewsStatus, string> = {
  draft: 'Черновик',
  submitted: 'Отправлено',
  pending: 'На модерации',
  approved: 'Одобрено',
  rejected: 'Отклонено',
  published: 'Опубликовано',
  unpublished: 'Снято с публикации',
  archived: 'В архиве',
};

export const newsStatusColors: Record<NewsStatus, string> = {
  draft: 'gray',
  submitted: 'blue',
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
  published: 'green',
  unpublished: 'orange',
  archived: 'gray',
};

export function getNewsStatusLabel(status: NewsStatus): string {
  return newsStatusLabels[status] || status;
}

export function getNewsStatusColor(status: NewsStatus): string {
  return newsStatusColors[status] || 'gray';
}
