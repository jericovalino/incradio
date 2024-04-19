import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Local } from '../schema';

const getlocals = () => axios.get<Local[]>('/core_locals');

const useLocalListQuery = () => {
  return useQuery({
    queryKey: ['LOCALS'],
    queryFn: getlocals,
    select: (resData) => resData.data,
  });
};

export default useLocalListQuery;
