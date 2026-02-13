/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // 배포용 .exe 파일을 만들기 위해 다시 켭니다. API 기능을 위해 개발 중에는 끕니다.
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
