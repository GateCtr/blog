import type { ComponentType } from 'react';
import type { Post } from '../types';

export interface PostEntry extends Post {
  Component: ComponentType;
}

interface MDXModule {
  default: ComponentType;
  frontmatter: Post;
}

const modules = import.meta.glob<MDXModule>('../posts/*.mdx', { eager: true });

const _posts: PostEntry[] = Object.entries(modules)
  .map(([, mod]) => ({
    ...mod.frontmatter,
    id: mod.frontmatter.slug,
    Component: mod.default,
  }))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function getPosts(): PostEntry[] {
  return _posts;
}

export function getPostBySlug(slug: string): PostEntry | undefined {
  return _posts.find(p => p.slug === slug);
}

export interface CategoryEntry {
  id: string;
  name: string;
  count: number;
}

export function getCategories(): CategoryEntry[] {
  const counts: Record<string, number> = {};
  for (const post of _posts) {
    counts[post.category] = (counts[post.category] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
