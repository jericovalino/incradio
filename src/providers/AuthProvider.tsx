'use client';
import { createContext, useEffect, useState } from 'react';

import {
  useSignOutMutation,
  useProfileDataQuery,
} from '@/app/authentication/_hooks';
import { SplashScreen } from '@/components/containers';
import { Profile } from '@/app/authentication/schema';

type AuthContext = {
  profileData?: Profile;
  isSigningOut: boolean;
  isLoadingProfile: boolean;
  signOut: ReturnType<typeof useSignOutMutation>['mutate'];
};

export const AuthContext = createContext<AuthContext | null>(null);

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    isFetched,
  } = useProfileDataQuery();

  const { mutate: signOut, isPending: isSigningOut } = useSignOutMutation();

  return (
    <AuthContext.Provider
      value={{
        profileData,
        isLoadingProfile,
        signOut,
        isSigningOut,
      }}
    >
      {isLoadingProfile && !isFetched ? <SplashScreen /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
