import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { type Link } from '../schema';

const getLinks = () => axios.get<Link[]>('/core_links');

const useLinkListQuery = () => {
  return useQuery({
    queryKey: ['LINKS'],
    queryFn: getLinks,
    select: (resData) => resData.data,
  });
};

export default useLinkListQuery;
