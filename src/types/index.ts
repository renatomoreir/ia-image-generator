export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
  isFavorite: boolean;
  isPublic: boolean;
  username?: string;
}

export interface User {
  username: string;
  credits: number;
  publicImages: GeneratedImage[];
}

export interface ImageGenerationRequest {
  prompt: string;
  userId?: string;
}

export interface ImageGenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  creditsRemaining?: number;
}

export interface AppState {
  images: GeneratedImage[];
  favorites: GeneratedImage[];
  user: User;
  isLoading: boolean;
  error: string | null;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface ShareableImage extends GeneratedImage {
  shareUrl: string;
  shareText: string;
}

export interface HuggingFaceResponse {
  generated_text?: string;
  error?: string;
}

export interface ReplicateResponse {
  id: string;
  status: string;
  output?: string[];
  error?: string;
}

export interface DeepAIResponse {
  id: string;
  output_url?: string;
  error?: string;
}

export const STORAGE_KEYS = {
  FAVORITES: 'ai-generator-favorites',
  USER_DATA: 'ai-generator-user',
  GENERATED_IMAGES: 'ai-generator-images',
} as const;

export const INITIAL_CREDITS = 100;
export const CREDITS_PER_GENERATION = 5;
export const MAX_PROMPT_LENGTH = 500;

export type ImageSize = 'small' | 'medium' | 'large';
export type ImageStyle = 'realistic' | 'artistic' | 'cartoon' | 'abstract';
export type SortOrder = 'newest' | 'oldest' | 'favorites';

export interface ImageFilters {
  size?: ImageSize;
  style?: ImageStyle;
  sortOrder: SortOrder;
  showFavoritesOnly: boolean;
}

