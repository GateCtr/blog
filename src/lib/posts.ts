import type { ComponentType } from 'react';
import type { Post } from '../types';
import type { Lang } from '../context/LangContext';

export interface PostEntry extends Post {
  Component: ComponentType;
}

interface MDXModule {
  default: ComponentType;
  frontmatter: Post;
}

const enModules = import.meta.glob<MDXModule>('../posts/*.mdx', { eager: true });
const frModules = import.meta.glob<MDXModule>('../posts/fr/*.mdx', { eager: true });

function buildPosts(modules: Record<string, MDXModule>): PostEntry[] {
  return Object.entries(modules)
    .map(([, mod]) => ({
      ...mod.frontmatter,
      id: mod.frontmatter.slug,
      Component: mod.default,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const enPosts = buildPosts(enModules);
const frPosts = buildPosts(frModules);

export function getPosts(lang: Lang = 'en'): PostEntry[] {
  return lang === 'fr' ? frPosts : enPosts;
}

export function getPostBySlug(slug: string, lang: Lang = 'en'): PostEntry | undefined {
  return getPosts(lang).find(p => p.slug === slug);
}

export interface CategoryEntry {
  id: string;
  name: string;
  count: number;
}

export function getCategories(lang: Lang = 'en'): CategoryEntry[] {
  const counts: Record<string, number> = {};
  for (const post of getPosts(lang)) {
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
