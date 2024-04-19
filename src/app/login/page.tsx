'use client';

import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { redirect } from 'next/navigation';

import { coloredLogo } from '@/assets/images';

import { useAuthentication } from '../authentication/_hooks';
import { Button } from '@/components/input_controls';

export default function Login() {
  const { signInWithGoogle, isAuthenticated } = useAuthentication();

  return (
    <div className="h-screen bg-color-gradient p-5">
      <div className="absolute bg-image-pattern inset-0 w-full h-full bg-no-repeat bg-cover" />
      <div className="w-full h-full relative items-center justify-center flex flex-col  z-10">
        <div className="absolute top-0 left-0 flex space-x-2 items-center">
          <Image alt="logo" src={coloredLogo} width={150} />
          <h1 className="text-4xl text-black/30 font-bold">| clicks</h1>
        </div>

        <Button
          size="large"
          leftIcon={FcGoogle}
          onClick={() =>
            signInWithGoogle(undefined, {
              onSuccess: () => {
                redirect('/login');
              },
            })
          }
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
