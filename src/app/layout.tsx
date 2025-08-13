import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// import Providers from '@/components/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PhotoPlatform - Connect with Professional Photographers',
  description: 'Find and hire professional photographers for your special events, portraits, and commercial projects.',
  keywords: 'photography, photographers, hire photographer, wedding photography, portrait photography',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Providers> */}
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        {/* </Providers> */}
      </body>
    </html>
  );
}