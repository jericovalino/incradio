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
        ({ isLoading }) => (
          <ModalCard onClose={close} title="Add Local" theme="float">
            <div className="space-y-4">
              <header>
                <h3 className="text-lg font-semibold leading-5">Add Local</h3>
                <p className="text-sm">Lorem ipsum dolor</p>
              </header>
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
            </div>
          </ModalCard>
        ),
    });
  }, [createModal, queryClient, createLocal]);

  return {
    openLocalCreationModal,
  };
};

export default useLocalCreation;
