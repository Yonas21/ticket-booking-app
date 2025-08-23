import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  author = 'BusTicket',
  publishedAt,
  modifiedAt,
  section,
  tags = []
}) => {
  const siteTitle = 'BusTicket - Book Bus Tickets Online';
  const siteDescription = 'Book bus tickets online for your next journey. Find the best deals on bus tickets across Africa. Secure, fast, and reliable bus booking platform.';
  const siteUrl = 'https://busticket.com';
  const siteImage = '/logo.svg';

  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const fullDescription = description || siteDescription;
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image ? `${siteUrl}${image}` : `${siteUrl}${siteImage}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="BusTicket" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@busticket" />
      <meta name="twitter:creator" content="@busticket" />
      
      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {publishedAt && <meta property="article:published_time" content={publishedAt} />}
          {modifiedAt && <meta property="article:modified_time" content={modifiedAt} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'article' ? 'Article' : 'WebPage',
          "headline": fullTitle,
          "description": fullDescription,
          "url": fullUrl,
          "image": fullImage,
          "publisher": {
            "@type": "Organization",
            "name": "BusTicket",
            "logo": {
              "@type": "ImageObject",
              "url": `${siteUrl}/logo.svg`
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": fullUrl
          },
          ...(type === 'article' && {
            "datePublished": publishedAt,
            "dateModified": modifiedAt,
            "author": {
              "@type": "Organization",
              "name": author
            }
          })
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
