/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['firebasestorage.googleapis.com'],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://mahalleci.com',
    NEXT_PUBLIC_SITE_NAME: 'Mahalleci',
    NEXT_PUBLIC_SITE_DESCRIPTION: 'Mahallenizi Keşfedin ve Paylaşın',
    NEXT_PUBLIC_CONTACT_EMAIL: 'info@mahalleci.com',
  },
}

module.exports = nextConfig 