import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/shared/ui/Navbar';
import AuthProvider from '@/providers/AuthProvider';
import Providers from '@/providers/Providers';

const geistSans = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Roboto_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '모임 목록',
  description: '모임 목록 페이지 입니다.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Providers>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
