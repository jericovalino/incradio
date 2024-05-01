import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { type Link } from '../schema';
import dayjs from 'dayjs';

const getLinks = () => axios.get<Link[]>('/core_links');

const transformLink = (data: Link): Link & { created_at_human: string } => ({
  ...data,
  created_at_human: dayjs(data.created_at).format('DD/MM/YYYY hh:mm A'),
});

const useLinkListQuery = () => {
  return useQuery({
    queryKey: ['LINKS'],
    queryFn: getLinks,
    select: (resData) => resData.data.map(transformLink),
  });
};

export default useLinkListQuery;
