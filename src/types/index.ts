export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: number;
  coverImage?: string;
  publishAt?: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}
