import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { type Link } from '../../schema';

const getLink = (link_uuid: string) =>
  axios.get<Link>(`/core_links/${link_uuid}`);

const useLinkDataQuery = (link_uuid: string) => {
  return useQuery({
    queryKey: ['LINKS', link_uuid],
    queryFn: () => getLink(link_uuid),
    select: (resData) => resData.data,
  });
};

export default useLinkDataQuery;
