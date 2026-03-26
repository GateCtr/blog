import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://blog.gatectr.com';
const SITE_NAME = 'GateCtr Blog';
const DEFAULT_IMAGE = `${BASE_URL}/logo.svg`;

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
}

export default function SEO({
  title,
  description,
  canonical,
  type = 'website',
  article,
  jsonLd,
}: SEOProps) {
  const fullTitle = `${title} — ${SITE_NAME}`;
  const url = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={DEFAULT_IMAGE} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

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
