export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: number;
  coverImage?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}
