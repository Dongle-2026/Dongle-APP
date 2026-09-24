export interface Slide {
  id: string;
  type: 'image' | 'content';
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
  tags: string[];
  createdAt: string;
  updatedAt: string;
  url?: string;
}

export interface CardNews extends News {
  isSaved: boolean;
  slides?: Slide[];
}

export interface Comment {
  id: string;
  newsId: string;
  author: string;
  content: string;
  createdAt: string;
  avatar?: string;
}

export interface UserAction {
  newsId: string;
  action: 'like' | 'unlike' | 'save' | 'unsave';
  timestamp: string;
}

export interface Category {
  id: string;
  name: string;
  isNew?: boolean;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

export interface ApiError {
  error: string;
  status: number;
  message: string;
}
