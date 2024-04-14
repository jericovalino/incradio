import supabase from '@/utils/supabase/client';
import { useMutation } from '@tanstack/react-query';

const signOut = () => {
  console.log('signout');
  return supabase.auth.signOut();
};

const useSignOutMutation = () => {
  return useMutation({
    mutationKey: ['SIGN_OUT'],
    mutationFn: signOut,
  });
};

export default useSignOutMutation;
