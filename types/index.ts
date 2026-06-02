// Type definitions for the app

export interface News {
  id: string;
  title: string;
  description: string;
  content: string;
  image?: string;
  author: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  url?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
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
