import { Inter } from 'next/font/google';

import { AuthProvider, QueryProvider } from '@/providers';

import '../assets/styles/tailwind.css';

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
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            {/* ... */}
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
