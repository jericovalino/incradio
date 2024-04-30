import { ModalCard } from '@/components/containers';
import { useCreateModal } from '@/hooks';
import { useCallback } from 'react';
import { LinkCreationForm } from '../_contents';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
// import { LocalPayload } from '../_contents/LocalCreationForm';
import { toast } from 'react-toastify';

const createLink = (payload: any) => axios.post('core_links', payload);

const useCreateLinkMutation = () => {
  return useMutation({
    mutationKey: ['CREATE_LINK'],
    mutationFn: createLink,
  });
};

const useLinkCreation = () => {
  const queryClient = useQueryClient();
  const { mutate: createLink, isPending: isLoading } = useCreateLinkMutation();

  const createModal = useCreateModal('CREATE_LINK', { isLoading });
  const openLinkCreationModal = useCallback(() => {
    createModal({
      content:
        (close) =>
        ({ isLoading }) => (
          <ModalCard onClose={close} title="Add Link">
            <LinkCreationForm
              onSubmit={(values) => {
                createLink(values, {
                  onSuccess: () => {
                    close();
                    toast.success('New Link Added');
                    queryClient.invalidateQueries({
                      queryKey: ['LINKS'],
                    });
                  },
                });
              }}
              disabled={isLoading}
            />
          </ModalCard>
        ),
    });
  }, [createModal, queryClient, createLink]);

  return {
    openLinkCreationModal,
  };
};

export default useLinkCreation;
