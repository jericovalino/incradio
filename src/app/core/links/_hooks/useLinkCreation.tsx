import axios from 'axios';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useCreateModal } from '@/hooks';

import { ModalCard } from '@/components/containers';

import { LinkForm } from '../_contents';

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
          <ModalCard onClose={close} title="Add Link" theme="float">
            <div className="space-y-4">
              <header>
                <h3 className="text-lg font-semibold leading-5">Add Link</h3>
                <p className="text-sm">Lorem ipsum dolor</p>
              </header>
              <LinkForm
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
            </div>
          </ModalCard>
        ),
    });
  }, [createModal, queryClient, createLink]);

  return {
    openLinkCreationModal,
  };
};

export default useLinkCreation;
