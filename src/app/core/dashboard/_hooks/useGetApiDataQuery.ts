import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const getApi = () => axios.get('/api');

const useGetApiDataQuery = () => {
  return useQuery({
    queryKey: ['TEST'],
    queryFn: getApi,
  });
};

export default useGetApiDataQuery;
