'use client';
import { createContext, useEffect, useState } from 'react';

import {
  useSignOutMutation,
  useProfileDataQuery,
  useSignInWithGoogleMutation,
} from '@/app/authentication/_hooks';
import { SplashScreen } from '@/components/containers';
import { Profile } from '@/app/authentication/schema';

type AuthContext = {
  profileData: Profile | null;
  isAuthenticated: boolean;
  isSigningIn: boolean;
  isSigningOut: boolean;
  isLoadingProfile: boolean;
  signInWithGoogle: ReturnType<typeof useSignInWithGoogleMutation>['mutate'];
  signOut: ReturnType<typeof useSignOutMutation>['mutate'];
};

export const AuthContext = createContext<AuthContext | null>(null);

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const {
    data: profileQueryData,
    isLoading: isLoadingProfile,
    isFetched,
  } = useProfileDataQuery();
  const { mutate: signInWithGoogle, isPending: isSigningIn } =
    useSignInWithGoogleMutation();

  const { mutate: signOut, isPending: isSigningOut } = useSignOutMutation();

  useEffect(() => {
    if (profileQueryData) setProfileData(profileQueryData);
  }, [profileQueryData, setProfileData]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(profileData),
        profileData,
        isLoadingProfile,
        signInWithGoogle,
        isSigningIn,
        signOut,
        isSigningOut,
      }}
    >
      {isLoadingProfile && !isFetched ? <SplashScreen /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
