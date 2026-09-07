export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]> | null;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface Period {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  theme: string | null;
}

export interface Department {
  id: number;
  period_id: number;
  name: string;
  name_en: string;
  slug: string;
  type: 'leader' | 'core' | 'department';
  description: string | null;
  icon: string | null;
  sort_order: number;
}

export interface WorkProgram {
  id: number;
  department_id: number;
  period_id: number;
  name: string;
  slug: string;
  description: string | null;
  objectives: string | null;
  status: 'planned' | 'in_progress' | 'completed' | 'postponed' | 'cancelled';
  planned_date: string | null;
  actual_date: string | null;
  planned_end_date: string | null;
  actual_end_date: string | null;
  is_highlight: boolean;
  cover_image_url: string | null;
  participant_count: number | null;
  sort_order: number;
  tags?: string[];
  department?: Department;
}

export interface Member {
  id: number;
  full_name: string;
  student_id: string;
  study_program: string;
  batch_year: number;
  photo_url: string | null;
  linkedin_url: string | null;
  instagram_handle: string | null;
  bio: string | null;
}

export interface ManagementRole {
  id: number;
  name: string;
  name_en: string;
  level: number;
}

export interface ManagementStructure {
  id: number;
  member: Member;
  role: ManagementRole;
  department?: Department;
  is_active: boolean;
  joined_at: string | null;
  ended_at: string | null;
}

export interface SiteStat {
  id: number;
  key: string;
  label: string;
  value: string;
  icon: string | null;
  sort_order: number;
}

export interface AboutContent {
  id: number;
  period_id: number;
  organization_history: string | null;
  vision: string | null;
  mission: string[] | null;
  values: Array<{ title: string; description: string }> | null;
  logo_url: string | null;
  logo_description: string | null;
  is_active: boolean;
  period?: Period;
}

export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string;
  cover_image_url: string | null;
  category: 'news' | 'announcement' | 'achievement' | 'academic' | 'event';
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  view_count: number;
  published_at: string | null;
  tags?: string[];
  author?: { id: number; name: string };
}

export interface GalleryItem {
  id: number;
  file_url: string;
  thumbnail_url: string | null;
  type: 'photo' | 'video';
  caption: string | null;
  sort_order: number;
}

export interface GalleryEvent {
  id: number;
  period_id: number;
  title: string;
  slug: string;
  description: string | null;
  event_date: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  items_count?: number;
  items?: GalleryItem[];
}

export interface ArchiveResource {
  id: number;
  title: string;
  description: string | null;
  category: 'syllabus' | 'exam_bank' | 'module' | 'org_template' | 'other';
  file_url: string;
  file_type: string | null;
  file_size_kb: number | null;
  academic_year: string | null;
  semester: number | null;
  subject: string | null;
  download_count: number;
}

export interface Aspiration {
  id: number;
  tracking_code: string;
  category: 'academic' | 'facility' | 'internal' | 'general' | 'other';
  subject: string;
  message: string;
  status: 'submitted' | 'under_review' | 'in_progress' | 'resolved' | 'rejected';
  is_anonymous: boolean;
  display_name: string;
  is_public: boolean;
  resolved_at: string | null;
  created_at: string;
  responses?: Array<{
    id: number;
    message: string;
    is_public: boolean;
    created_at: string;
  }>;
}

export interface AspirationStats {
  submitted: number;
  under_review: number;
  in_progress: number;
  resolved: number;
  rejected: number;
  total: number;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  avatar_url: string | null;
  last_login_at: string | null;
}

export interface LoginPayload {
  user: AuthUser;
  token: string;
  token_type: string;
}
