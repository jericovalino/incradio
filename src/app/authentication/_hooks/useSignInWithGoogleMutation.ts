import supabase from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';

const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${location.origin}?from=google`,
    },
  });

const useSignInWithGoogleMutation = () => {
  return useMutation({
    mutationKey: ['SIGN_IN'],
    mutationFn: signInWithGoogle,
  });
};

export default useSignInWithGoogleMutation;
