import axios from 'axios';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useCreateModal } from '@/hooks';
import { DialogCard } from '@/components/containers';

const deleteLocale = (id: string) => axios.delete(`/core_locales/${id}`);

const useDeleteLocaleMutation = () => {
  return useMutation({
    mutationKey: ['DELETE_LOCALE'],
    mutationFn: (link_id: string) => deleteLocale(link_id),
  });
};

type Props = Pick<
  React.ComponentPropsWithoutRef<typeof DialogCard>,
  'onYes' | 'onNo' | 'onClose' | 'isLoading'
>;

const LocaleDeletionConfirmationDialog = ({
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
      yesLabel="Delete"
      isLoading={isLoading}
      title="Delete Locale"
      question="Are you sure you want to continue?"
      message="Once you click 'Delete', you won't be able to undo the changes."
    />
  );
};

const useLocaleDeletion = () => {
  const queryClient = useQueryClient();
  const { mutate: deleteLocale, isPending: isLoading } =
    useDeleteLocaleMutation();

  const createModal = useCreateModal('DELETE_LOCALE', { isLoading });
  const openLocaleDeletionConfirmationDialog = useCallback(
    (locale_id: string) => {
      createModal({
        content:
          (close) =>
          ({ isLoading }) => (
            <LocaleDeletionConfirmationDialog
              onNo={close}
              onClose={close}
              isLoading={isLoading}
              onYes={() =>
                deleteLocale(locale_id, {
                  onSuccess: () => {
                    close();
                    toast.success('Locale deleted.');
                    queryClient.invalidateQueries({
                      queryKey: ['LOCALES'],
                    });
                  },
                })
              }
            />
          ),
      });
    },
    [createModal, deleteLocale, queryClient]
  );

  return { openLocaleDeletionConfirmationDialog };
};

export default useLocaleDeletion;
