import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import NextAuthProvider from './providers';
import Layout from '@/components/Layout';
import Header from '@/components/Header';
import "@/app/globals.css";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-text`}>
        <NextAuthProvider>
          <Header />
          <Layout>{children}</Layout>
        </NextAuthProvider>
      </body>
    </html>
  );
}
