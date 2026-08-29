import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://gdpu-innovation-practice.carychan.chatgpt.site'),
  title: '广东药科大学创新实践协会｜2026 招新',
  description: '把想法焊成现实，用代码创造世界。探索创协真实作品、竞赛战绩与招新方式。',
  icons: { icon: '/media/association-logo.jpg' },
  openGraph: {
    title: '广东药科大学创新实践协会｜2026 招新',
    description: '把想法焊成现实，用代码创造世界。',
    type: 'website',
    images: [{ url: '/og.png', width: 1672, height: 941, alt: '广东药科大学创新实践协会招新' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '广东药科大学创新实践协会｜2026 招新',
    description: '把想法焊成现实，用代码创造世界。',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#020711',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
