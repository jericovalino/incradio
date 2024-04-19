import { useCallback, useContext, useEffect, useRef } from 'react';

import { ModalContext } from '@/providers/ModalProvider';

type CreateModalProp<TState> = {
  title?: string;
  content:
    | ((close: () => void, minimize: () => void) => React.ReactNode)
    | ((
        close: () => void,
        minimize: () => void
      ) => (state: TState) => React.ReactNode);
};

const useCreateModal = <TState>(key = 'modal', state?: TState) => {
  const context = useContext(ModalContext);
  const prevStateRef = useRef<TState | null>(null);

  useEffect(() => {
    if (state) {
      if (JSON.stringify(prevStateRef.current) === JSON.stringify(state)) {
        return;
      }
      prevStateRef.current = state;
      context?.setStates((prev) => ({ ...prev, [key]: state }));
    }
  }, [state, context?.setStates, key]);

  const createModal = useCallback(
    ({ title = 'Unnamed Tab', content }: CreateModalProp<TState>) => {
      const modalKey = `${key}-${Date.now()}`;
      const minimizeModal = () =>
        context?.setModals((prev) =>
          prev.map((modal) =>
            modal.key === modalKey
              ? {
                  ...modal,
                  status: 'minimize',
                }
              : modal
          )
        );

      const closeThisModal = () => {
        context?.setModals((prev) =>
          prev.filter((modal) => modal.key !== modalKey)
        );
      };
      context?.setModals((prev) => [
        ...prev,
        {
          key: modalKey,
          hookKey: key,
          title,
          status: 'open',
          content: content(closeThisModal, minimizeModal),
        },
      ]);
    },
    [key, context?.setModals]
  );
  return createModal;
};

export const useDestroyModals = () => {
  const context = useContext(ModalContext);

  const destroyModals = useCallback(() => {
    context?.setModals(() => []);
    context?.setStates(() => ({ init: '' }));
  }, [context]);

  return destroyModals;
};

export default useCreateModal;
