import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';

import { cn } from '@/utils';
import { QueryProvider, ModalProvider } from '@/providers';

import '../assets/styles/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>INC Radio</title>
      </head>
      <body className={cn(inter.className, 'text-gray-600')}>
        <QueryProvider>
          <ModalProvider>
            {/* ... */}
            <Suspense>{children}</Suspense>
            <ToastContainer />
          </ModalProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
