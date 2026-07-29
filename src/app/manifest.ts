import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MITRA — Always by your side',
    short_name: 'MITRA',
    description: 'Mentoring Intelligence for Tribal Residential Ashramshala',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf6ee',
    theme_color: '#faf6ee',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
