import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Yembal - Acheter. Vendre. Simplement.',
    short_name: 'Yembal',
    description: 'La marketplace pour acheter et vendre localement au Sénégal.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F7F5',
    theme_color: '#0F8B6D',
    icons: [
      { src: '/icon', sizes: '48x48', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
