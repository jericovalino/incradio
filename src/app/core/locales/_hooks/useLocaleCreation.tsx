import axios from 'axios';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useCreateModal } from '@/hooks';
import { ModalCard } from '@/components/containers';

import { LocaleForm, type LocalePayload } from '../_contents';

const createLocale = (payload: LocalePayload) =>
  axios.post('core_locales', payload);

const useCreateLocaleMutation = () => {
  return useMutation({
    mutationKey: ['CREATE_LOCALE'],
    mutationFn: createLocale,
  });
};

const useLocaleCreation = () => {
  const queryClient = useQueryClient();
  const { mutate: createLocale, isPending: isLoading } =
    useCreateLocaleMutation();

  const createModal = useCreateModal('CREATE_LOCALE', { isLoading });
  const openLocaleCreationModal = useCallback(() => {
    createModal({
      content:
        (close) =>
        ({ isLoading }) => (
          <ModalCard onClose={close} title="Add Locale" theme="float">
            <div className="space-y-4">
              <header>
                <h3 className="text-lg font-semibold leading-5">Add Locale</h3>
                <p className="text-sm">Lorem ipsum dolor</p>
              </header>
              <LocaleForm
                onSubmit={(values) => {
                  createLocale(values, {
                    onSuccess: () => {
                      close();
                      toast.success('New Locale Added');
                      queryClient.invalidateQueries({
                        queryKey: ['LOCALES'],
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
  }, [createModal, queryClient, createLocale]);

  return {
    openLocaleCreationModal,
  };
};

export default useLocaleCreation;
