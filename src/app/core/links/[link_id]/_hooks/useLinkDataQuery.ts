import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { type Link } from '../../schema';

const getLink = (link_id: string) => axios.get<Link>(`/core_links/${link_id}`);

const useLinkDataQuery = (link_id: string) => {
  return useQuery({
    queryKey: ['LINKS', link_id],
    queryFn: () => getLink(link_id),
    select: (resData) => resData.data,
  });
};

export default useLinkDataQuery;
