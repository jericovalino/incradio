import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { ClickHistory } from '../../schema';
import dayjs from 'dayjs';

const transformHistory = (
  data: ClickHistory
): ClickHistory & { created_at_human: string } => ({
  ...data,
  created_at_human: dayjs(data.created_at).format('DD/MM/YYYY hh:mm A'),
});

const getLinkClickHistories = (link_id: string) =>
  axios.get<ClickHistory[]>(`/core_links/${link_id}/histories`);

const useLinkClickHistoryListQuery = (link_id: string) => {
  return useQuery({
    queryKey: ['LINKS', link_id, 'CLICKS'],
    queryFn: () => getLinkClickHistories(link_id),
    select: (resData) => resData.data.map(transformHistory),
  });
};

export default useLinkClickHistoryListQuery;
