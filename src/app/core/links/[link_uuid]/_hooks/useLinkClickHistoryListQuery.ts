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

const getLinkClickHistories = (link_uuid: string) =>
  axios.get<ClickHistory[]>(`/core_links/${link_uuid}/histories`);

const useLinkClickHistoryListQuery = (link_uuid: string) => {
  return useQuery({
    queryKey: ['LINKS', link_uuid, 'CLICKS'],
    queryFn: () => getLinkClickHistories(link_uuid),
    select: (resData) => resData.data.map(transformHistory),
  });
};

export default useLinkClickHistoryListQuery;
