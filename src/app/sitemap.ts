import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  // Définis ton URL de base ici
  const baseUrl = 'https://comptalibre.vercel.app'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // Si tu ajoutes plus tard des pages comme /contact ou /tarifs, 
    // tu les ajouteras ici comme ceci :
    /*
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    */
  ]
}