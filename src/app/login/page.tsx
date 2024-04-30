'use client';

import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { redirect } from 'next/navigation';

import { coloredLogo } from '@/assets/images';

import { Button } from '@/components/input_controls';

import { useSignInWithGoogleMutation } from '../authentication/_hooks';

const Login = () => {
  const { mutate: signInWithGoogle } = useSignInWithGoogleMutation();

  return (
    <div className="bg-color-gradient h-screen p-5">
      <div className="bg-image-pattern absolute inset-0 h-full w-full bg-cover bg-no-repeat" />
      <div className="relative z-10 flex h-full w-full flex-col items-center  justify-center">
        <div className="absolute left-0 top-0 flex items-center space-x-2">
          <Image alt="logo" src={coloredLogo} width={150} />
          <h1 className="text-4xl font-bold text-black/30">| clicks</h1>
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
};

export default Login;
