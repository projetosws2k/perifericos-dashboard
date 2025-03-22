import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PerifControl - Gerenciamento de Periféricos',
  description: 'Sistema de gerenciamento de periféricos para WS2K SUPORTE TÉCNICO',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex">
              <Sidebar />
              <div className="flex-1">
                <Header />
                <main className="p-6">{children}</main>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}