import supabase from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Profile } from '../schema';

const getProfile = () => axios.get<Profile>('/core_users/profile');

const useProfileDataQuery = () => {
  return useQuery({
    queryKey: ['PROFILE'],
    queryFn: getProfile,
    select: (resData) => resData.data,
    staleTime: Infinity,
  });
};

export default useProfileDataQuery;
