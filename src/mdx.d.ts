declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const Component: ComponentType;
  export default Component;
  export const frontmatter: {
    slug: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    readTime: number;
    coverImage?: string;
  };
}
