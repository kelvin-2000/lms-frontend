import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MainLayout from '@/components/layout/MainLayout';
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LMS Platform | Learn, Connect, Grow',
  description:
    'Your all-in-one platform for online courses, events, job opportunities, and mentorship programs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
