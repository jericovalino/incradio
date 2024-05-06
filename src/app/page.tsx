'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ColoredLogo } from '@/components/informationals';

function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get('from') !== 'google') return;
    if (searchParams.get('error_code') === '500')
      return router.push('/access-denied');
    console.log('redirecting to /core');
    const t = setTimeout(() => {
      router.push('/core');
    }, 500);
    return () => {
      clearTimeout(t);
    };
  }, [searchParams, router]);
  return (
    <div className="bg-color-gradient h-screen p-5">
      <div className="bg-image-pattern absolute inset-0 h-full w-full bg-cover bg-no-repeat" />
      <div className="relative z-10 flex h-full w-full flex-col items-center  justify-center">
        <div className="absolute left-0 top-0 flex items-center space-x-2">
          <ColoredLogo width={150} />
          <h1 className="text-4xl font-bold text-black/30">| clicks</h1>
        </div>
      </div>
    </div>
  );
}

export default Home;
