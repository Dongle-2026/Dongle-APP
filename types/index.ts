export type SaveAction = 'save' | 'unsave';

export interface Slide {
  id: string;
  type: 'thumbnail' | 'content';
  image?: string;
  title?: string;
  description?: string;
}

export interface News {
  id: string;
  title: string;
  description: string;
  content: string;
  image?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  isSaved: boolean;
  url?: string;
}

export interface CardNews extends News {
  slides?: Slide[];
}

export interface ApiError {
  error: string;
  status: number;
  message: string;
}

export interface UserAction {
  newsId: string;
  action: SaveAction;
  timestamp: string;
}
