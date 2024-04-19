import { ModalCard } from '@/components/containers';
import { useCreateModal } from '@/hooks';
import { useCallback } from 'react';
import { LocalCreationForm } from '../_contents';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { LocalPayload } from '../_contents/LocalCreationForm';
import { toast } from 'react-toastify';

const createLocal = (payload: LocalPayload) =>
  axios.post('core_locals', payload);

const useCreateLocalMutation = () => {
  return useMutation({
    mutationKey: ['CREATE_LOCAL'],
    mutationFn: createLocal,
  });
};

const useLocalCreation = () => {
  const queryClient = useQueryClient();
  const { mutate: createLocal, isPending: isLoading } =
    useCreateLocalMutation();

  const createModal = useCreateModal('CREATE_LOCAL', { isLoading });
  const openLocalCreationModal = useCallback(() => {
    createModal({
      content:
        (close) =>
        ({ isLoading }) =>
          (
            <ModalCard onClose={close} title="Add Local">
              <LocalCreationForm
                onSubmit={(values) => {
                  createLocal(values, {
                    onSuccess: () => {
                      close();
                      toast.success('New Local Added');
                      queryClient.invalidateQueries({
                        queryKey: ['LOCALS'],
                      });
                    },
                  });
                }}
                disabled={isLoading}
              />
            </ModalCard>
          ),
    });
  }, [createModal, queryClient]);

  return {
    openLocalCreationModal,
  };
};

export default useLocalCreation;
