import { Suspense } from 'react';
import { Inter } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { ToastContainer, Flip } from 'react-toastify';

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
        <NextTopLoader color="#02583f" showSpinner={false} />
        <QueryProvider>
          <ModalProvider>
            {/* ... */}
            <Suspense>{children}</Suspense>
            <ToastContainer hideProgressBar transition={Flip} />
          </ModalProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
