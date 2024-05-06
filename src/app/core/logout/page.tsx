'use client';

import { useEffect } from 'react';

import { SplashScreen } from '@/components/containers';
import { useAuthentication } from '@/app/authentication/_hooks';

const Logout = () => {
  const { signOut } = useAuthentication();
  useEffect(signOut, [signOut]);
  return <SplashScreen />;
};

export default Logout;
