import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ComptaLibre',
    short_name: 'ComptaLibre',
    description: 'Extraction IA de relevés bancaires',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#2563eb', // Ton bleu principal
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}