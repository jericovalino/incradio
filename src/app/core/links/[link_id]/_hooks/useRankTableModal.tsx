import { useCallback, useRef } from 'react';
import { Table } from '@/components/informationals';
import { ModalCard } from '@/components/containers';
// import { Button } from '@/components/input_controls';

import { useCreateModal } from '@/hooks';
import { Rank } from '../schema';

type Props = {
  rankList: Rank[];
  onClose: () => void;
};
const RankTableModal = ({ rankList, onClose }: Props) => {
  const ref = useRef<HTMLTableElement | null>(null);

  // const copyTableElementContents = useCallback(() => {
  //   if (!ref.current) return;
  //   const body = document.body as HTMLElement & {
  //     createTextRange: () => {
  //       moveToElementText: (el: HTMLTableElement) => void;
  //       select: () => void;
  //     };
  //   };

  //   let range;
  //   let sel: Selection | null;
  //   if (document.createRange && window.getSelection) {
  //     range = document.createRange();
  //     sel = window.getSelection();
  //     sel?.removeAllRanges();
  //     try {
  //       range.selectNodeContents(ref.current);
  //       sel?.addRange(range);
  //     } catch (e) {
  //       range.selectNode(ref.current);
  //       sel?.addRange(range);
  //     }
  //   } else if (body.createTextRange) {
  //     range = body.createTextRange();
  //     range.moveToElementText(ref.current);
  //     range.select();
  //   }
  //   document.execCommand('Copy');
  // }, []);

  return (
    <ModalCard title="Locale Rankings" onClose={onClose} size="lg">
      <div className="h-96">
        <Table
          getRef={(el) => {
            ref.current = el;
          }}
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
      {/* <Button
        style="outline"
        theme="primary"
        className="mt-2 w-full"
        onClick={copyTableElementContents}
      >
        Copy Report
      </Button> */}
    </ModalCard>
  );
};

const useRankTableModal = () => {
  const createModal = useCreateModal();

  const openRankTableModal = useCallback(
    (rankList: Rank[]) => {
      createModal({
        content: (close) => (
          <RankTableModal rankList={rankList} onClose={close} />
        ),
      });
    },
    [createModal]
  );

  return { openRankTableModal };
};

export default useRankTableModal;
