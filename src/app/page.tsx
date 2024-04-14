'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { redirect, useSearchParams } from 'next/navigation';

import { coloredLogo } from '@/assets/images';

function Home() {
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log('client: to "/core"');
    if (searchParams.get('from') === 'google') redirect('/core');
  }, [searchParams]);
  return (
    <div className="h-screen bg-color-gradient p-5">
      <div className="absolute bg-image-pattern inset-0 w-full h-full bg-no-repeat bg-cover" />
      <div className="w-full h-full relative items-center justify-center flex flex-col  z-10">
        <div className="absolute top-0 left-0 flex space-x-2 items-center">
          <Image alt="logo" src={coloredLogo} width={150} />
          <h1 className="text-4xl text-black/30 font-bold">| clicks</h1>
        </div>
      </div>
    </div>
  );
}

export default Home;
