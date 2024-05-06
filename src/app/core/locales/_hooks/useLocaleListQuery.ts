import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { Locale } from '../schema';

const getlocales = () => axios.get<Locale[]>('/core_locales');

const useLocaleListQuery = () => {
  return useQuery({
    queryKey: ['LOCALES'],
    queryFn: getlocales,
    select: (resData) => resData.data,
  });
};

export default useLocaleListQuery;
