import { Helmet } from 'react-helmet-async';
import type { Lang } from '../context/LangContext';

const BASE_URL = 'https://blog.gatectr.com';
const SITE_NAME = 'GateCtr Blog';
const DEFAULT_IMAGE = `${BASE_URL}/logo.svg`;

const OG_LOCALE: Record<Lang, string> = {
  en: 'en_US',
  fr: 'fr_FR',
};

const ALTERNATE_LOCALE: Record<Lang, string> = {
  en: 'fr_FR',
  fr: 'en_US',
};

interface ArticleMeta {
  publishedTime: string;
  author: string;
  category: string;
}

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: 'website' | 'article';
  article?: ArticleMeta;
  jsonLd?: object;
  lang?: Lang;
  image?: string;
}

export default function SEO({
  title,
  description,
  canonical,
  type = 'website',
  article,
  jsonLd,
  lang = 'en',
  image,
}: SEOProps) {
  const fullTitle = `${title} — ${SITE_NAME}`;
  const url = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
  const htmlLang = lang === 'fr' ? 'fr' : 'en';
  const ogImage = image
    ? (image.startsWith('http') ? image : `${BASE_URL}${image}`)
    : DEFAULT_IMAGE;

  return (
    <Helmet>
      <html lang={htmlLang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <link rel="alternate" hrefLang="en" href={url} />
      <link rel="alternate" hrefLang="fr" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={OG_LOCALE[lang]} />
      <meta property="og:locale:alternate" content={ALTERNATE_LOCALE[lang]} />

      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {article && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {article && (
        <meta property="article:author" content={article.author} />
      )}
      {article && (
        <meta property="article:section" content={article.category} />
      )}

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
