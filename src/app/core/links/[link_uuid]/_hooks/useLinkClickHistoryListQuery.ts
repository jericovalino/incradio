import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { ClickHistory } from '../../schema';

const getLinkClickHistories = (link_uuid: string) =>
  axios.get<ClickHistory[]>(`/core_links/${link_uuid}/histories`);

const useLinkClickHistoryListQuery = (link_uuid: string) => {
  return useQuery({
    queryKey: ['LINKS', link_uuid, 'CLICKS'],
    queryFn: () => getLinkClickHistories(link_uuid),
    select: (resData) => resData.data,
  });
};

export default useLinkClickHistoryListQuery;
