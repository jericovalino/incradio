import axios from 'axios';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useCreateModal } from '@/hooks';

import { ModalCard } from '@/components/containers';

import { type Link } from '../../schema';
import { LinkForm, type LinkPayload } from '../../_contents';

type UpdateLinkProps = {
  payload: LinkPayload;
  link_id: string;
};
const updateLink = ({ link_id, payload }: UpdateLinkProps) =>
  axios.put(`/core_links/${link_id}`, payload);

const useUpdateLinkMutation = () => {
  return useMutation({
    mutationKey: ['UPDATE_LINK'],
    mutationFn: updateLink,
  });
};

const useLinkUpdating = () => {
  const queryClient = useQueryClient();
  const { mutate: updateLink, isPending: isLoading } = useUpdateLinkMutation();

  const createModal = useCreateModal('UPDATE_LINK', { isLoading });
  const openLinkUpdatingModal = useCallback(
    (link: Link) => {
      createModal({
        content:
          (close) =>
          ({ isLoading }) => (
            <ModalCard onClose={close} title="Update Link" theme="float">
              <div className="space-y-4">
                <header>
                  <h3 className="text-lg font-semibold leading-5">
                    Update Link
                  </h3>
                  <p className="text-sm">Lorem ipsum dolor</p>
                </header>
                <LinkForm
                  initData={link}
                  onSubmit={(values) => {
                    updateLink(
                      { link_id: link.id!, payload: values },
                      {
                        onSuccess: () => {
                          close();
                          toast.success('Link Updated');
                          queryClient.invalidateQueries({
                            queryKey: ['LINKS', link.id],
                          });
                        },
                      }
                    );
                  }}
                  disabled={isLoading}
                />
              </div>
            </ModalCard>
          ),
      });
    },
    [createModal, queryClient, updateLink]
  );

  return {
    openLinkUpdatingModal,
  };
};

export default useLinkUpdating;
