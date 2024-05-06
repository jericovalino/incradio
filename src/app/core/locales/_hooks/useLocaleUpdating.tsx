import axios from 'axios';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useCreateModal } from '@/hooks';
import { ModalCard } from '@/components/containers';

import { LocaleForm, type LocalePayload } from '../_contents';
import { type Locale } from '../schema';

type UpdateLocaleProps = {
  locale_id: string;
  payload: LocalePayload;
};
const updateLocale = ({ locale_id, payload }: UpdateLocaleProps) =>
  axios.put(`/core_locales/${locale_id}`, payload);

const useUpdateLocaleMutation = () => {
  return useMutation({
    mutationKey: ['UPDATE_LOCALE'],
    mutationFn: updateLocale,
  });
};

const useLocaleUpdating = () => {
  const queryClient = useQueryClient();
  const { mutate: updateLocale, isPending: isLoading } =
    useUpdateLocaleMutation();

  const createModal = useCreateModal('UPDATE_LOCALE', { isLoading });
  const openLocaleUpdatingnModal = useCallback(
    (locale: Locale) => {
      createModal({
        content:
          (close) =>
          ({ isLoading }) => (
            <ModalCard onClose={close} title="Update Locale" theme="float">
              <div className="space-y-4">
                <header>
                  <h3 className="text-lg font-semibold leading-5">
                    Update Locale
                  </h3>
                  <p className="text-sm">Lorem ipsum dolor</p>
                </header>
                <LocaleForm
                  initData={locale}
                  onSubmit={(values) => {
                    updateLocale(
                      {
                        locale_id: locale.id,
                        payload: values,
                      },
                      {
                        onSuccess: () => {
                          close();
                          toast.success('Locale Updated');
                          queryClient.invalidateQueries({
                            queryKey: ['LOCALES'],
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
    [createModal, queryClient, updateLocale]
  );

  return {
    openLocaleUpdatingnModal,
  };
};

export default useLocaleUpdating;
