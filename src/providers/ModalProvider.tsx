'use client';

import {
  useRef,
  useMemo,
  Fragment,
  useState,
  useEffect,
  useContext,
  createContext,
  type ReactNode,
} from 'react';
import { cn } from '@/utils';

type ModalContextType = {
  setModals: (func: (prev: ModalType[]) => ModalType[]) => void;
  modals: ModalType[] | [];
  setStates: (func: (prev: Record<string, any>) => Record<string, any>) => void;
  states: Record<string, Record<string, any>>;
};

export const ModalContext = createContext<ModalContextType | null>(null);

type ModalType = {
  key: string;
  hookKey: string;
  title: string;
  status: 'open' | 'minimize';
  content: React.ReactNode | ((state: any) => React.ReactNode);
};

const Modal = ({ modal, i }: { modal: ModalType; i: number }) => {
  const context = useContext(ModalContext);
  const [isTransformMinimize, setIsTransformMinimize] = useState(false);
  const { key, hookKey } = modal;

  const prevModalStateRef = useRef<any | null>(null);
  const modalState = useMemo(() => {
    if (context?.states[hookKey] !== prevModalStateRef.current) {
      prevModalStateRef.current = context?.states[hookKey];
    }
    return context?.states[hookKey];
  }, [context?.states, hookKey]);

  const handleMaximizeModal = () => {
    setIsTransformMinimize(false);
  };

  const handleTransitionEnd = (e: any) => {
    if (Array.from(e.target.classList).includes('modal-minimize')) {
      setIsTransformMinimize(true);
    }
  };

  const closeModal =
    (key: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      context?.setModals((prev) => prev.filter((modal) => modal.key !== key));
    };

  useEffect(() => {
    if (!isTransformMinimize) {
      context?.setModals((prev) =>
        prev.map((modal) =>
          modal.key === key ? { ...modal, status: 'open' } : modal
        )
      );
    }
  }, [isTransformMinimize, key, context?.setModals]);

  return (
    <>
      <div
        className={`bg-primary relative mr-1 flex cursor-pointer items-center rounded-tl-lg rounded-tr-lg border-l border-r border-t border-white px-2 py-1 ${
          isTransformMinimize ? '' : 'invisible'
        }`}
      >
        <button
          type="button"
          aria-label="maximize"
          className="absolute inset-0 h-full w-full"
          onClick={handleMaximizeModal}
        />
        <p className="whitespace-nowrap text-sm text-white">{modal.title}</p>
        <button
          type="button"
          className="relative z-10 ml-2 cursor-pointer"
          onClick={closeModal(modal.key)}
        >
          <i className="fa fa-times text-sm text-white" />
        </button>
      </div>
      <div
        className={cn(
          'modal fixed inset-0 bg-black bg-opacity-50 px-4 transition-all duration-100 ease-linear',
          modal?.status === 'open' ? '' : 'modal-minimize cursor-pointer',
          isTransformMinimize ? 'hidden' : ''
        )}
        style={{
          zIndex: 9999,
          right: modal.status === 'minimize' ? `${i * 4.875}rem` : '0',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        <div
          className="relative h-full w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {typeof modal?.content === 'function'
            ? modal?.content(modalState)
            : modal?.content}
        </div>
        {modal.status === 'minimize' && (
          <div className="absolute h-full w-full" />
        )}
      </div>
    </>
  );
};

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<ModalType[]>([]);
  const [states, setStates] = useState({});

  return (
    <ModalContext.Provider value={{ setModals, modals, setStates, states }}>
      <div className="fixed bottom-0 right-0 z-50 flex max-w-full flex-row-reverse overflow-x-scroll">
        {modals.map((modal, i) => (
          <Fragment key={modal.key}>
            <Modal modal={modal} i={i} />
          </Fragment>
        ))}
      </div>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
