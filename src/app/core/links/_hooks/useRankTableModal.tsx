import { useCallback } from 'react';
import { Table } from '@/components/informationals';
import { ModalCard } from '@/components/containers';

import { useCreateModal } from '@/hooks';
import { Rank } from '../[link_id]/schema';

const useRankTableModal = () => {
  const createModal = useCreateModal();

  const openRankTableModal = useCallback(
    (rankList: Rank[]) => {
      createModal({
        content: (close) => (
          <ModalCard title="Locale Rankings" onClose={close} size="lg">
            <div className="h-96">
              <Table
                data={rankList}
                format={[
                  {
                    label: 'Rank',
                    key: 'locale_code',
                    render: (_, i) => i + 1,
                  },
                  {
                    key: 'locale_name',
                    label: 'Locale Name',
                  },
                  {
                    key: 'click_count',
                    label: 'Number of clicks',
                  },
                ]}
              />
            </div>
          </ModalCard>
        ),
      });
    },
    [createModal]
  );

  return { openRankTableModal };
};

export default useRankTableModal;
