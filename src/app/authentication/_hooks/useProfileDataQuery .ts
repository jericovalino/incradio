import supabase from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

const getProfile = () =>
  supabase.auth.getUser().then((userData) => userData.data.user);

const useProfileDataQuery = () => {
  return useQuery({
    queryKey: ['PROFILE'],
    queryFn: getProfile,
    staleTime: Infinity,
  });
};

export default useProfileDataQuery;
