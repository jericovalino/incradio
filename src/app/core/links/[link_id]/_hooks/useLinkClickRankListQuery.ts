import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { Rank } from '../schema';

const getLinkClickRanks = (link_id: string) =>
  axios.get<Rank[]>(`/core_links/${link_id}/rankings`);

const useLinkClickRankListQuery = (link_id: string) => {
  return useQuery({
    queryKey: ['LINKS', link_id, 'RANKS'],
    queryFn: () => getLinkClickRanks(link_id),
    select: (resData) => resData.data,
  });
};

export default useLinkClickRankListQuery;
