import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { Rank } from '../schema';

const getLinkClickRanks = (link_uuid: string) =>
  axios.get<Rank[]>(`/core_links/${link_uuid}/rankings`);

const useLinkClickRankListQuery = (link_uuid: string) => {
  return useQuery({
    queryKey: ['LINKS', link_uuid, 'RANKS'],
    queryFn: () => getLinkClickRanks(link_uuid),
    select: (resData) => resData.data,
  });
};

export default useLinkClickRankListQuery;
