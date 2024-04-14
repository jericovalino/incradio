'use client';

import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';

import { coloredLogo } from '@/assets/images';
import { useAuthentication } from '../authentication/_hooks';
import { redirect } from 'next/navigation';

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

        <button
          type="button"
          className="flex px-3 py-2 rounded-lg shadow bg-white space-x-1 items-center animate-pulse hover:animate-none hover:scale-105 transition-transform active:scale-100"
          onClick={() =>
            signInWithGoogle(undefined, {
              onSuccess: () => {
                redirect('/login');
              },
            })
          }
        >
          <FcGoogle className="w-6 h-6" />
          <span className="text-gray-600 font-semibold text-lg">
            Sign in with Google
          </span>
        </button>
      </div>
    </div>
  );
}
