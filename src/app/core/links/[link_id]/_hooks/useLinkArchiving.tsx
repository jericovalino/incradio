import axios from 'axios';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DialogCard } from '@/components/containers';
import { useRouter } from 'next/navigation';
import { useCreateModal } from '@/hooks';

const archiveLink = (id: string) => axios.delete(`/core_links/${id}/archive`);

const useArchiveLinkMutation = () => {
  return useMutation({
    mutationKey: ['LINK', 'ARCHIVE'],
    mutationFn: (link_id: string) => archiveLink(link_id),
  });
};

type Props = Pick<
  React.ComponentPropsWithoutRef<typeof DialogCard>,
  'onYes' | 'onNo' | 'onClose' | 'isLoading'
>;

const LinkArchivingConfirmationDialog = ({
  onYes,
  onNo,
  onClose,
  isLoading,
}: Props) => {
  return (
    <DialogCard
      onNo={onNo}
      onYes={onYes}
      theme="danger"
      noLabel="Cancel"
      onClose={onClose}
      yesLabel="Archive"
      isLoading={isLoading}
      title="Archive Link"
      question="Are you sure you want to continue?"
      message="Once you click 'Archive', this link will be remove from the list."
    />
  );
};

const useLinkArchiving = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: archiveLink, isPending: isLoading } =
    useArchiveLinkMutation();

  const createModal = useCreateModal('LINK_ARCHIVE', { isLoading });
  const openLinkArchiveConfirmationDialog = useCallback(
    (link_id: string) => {
      createModal({
        content:
          (close) =>
          ({ isLoading }) => (
            <LinkArchivingConfirmationDialog
              onNo={close}
              onClose={close}
              isLoading={isLoading}
              onYes={() =>
                archiveLink(link_id, {
                  onSuccess: () => {
                    close();
                    router.push('/core/links');
                    toast.success('Link archived.');
                    queryClient.invalidateQueries({
                      queryKey: ['LINKS'],
                    });
                  },
                })
              }
            />
          ),
      });
    },
    [createModal, archiveLink, router, queryClient]
  );

  return { openLinkArchiveConfirmationDialog };
};

export default useLinkArchiving;
