import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const getApi = () => axios.get('/core_locales');

const useGetApiDataQuery = () => {
  return useQuery({
    queryKey: ['TEST'],
    queryFn: getApi,
  });
};

export default useGetApiDataQuery;
