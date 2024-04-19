import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { FaMinus, FaTimes } from 'react-icons/fa';

import { cn } from '@/utils';

const MAP_CONTAINER_SIZE_CLASSNAME = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

const MAP_HEADER_THEME_CLASSNAMES = {
  primary: 'bg-color-gradient',
  danger: 'bg-red-500',
  float: '',
} as const;

const MAP_BORDER_RADIUS_CLASSNAME = {
  sm: { container: 'rounded-sm', header: 'rounded-t-sm' },
  md: { container: 'rounded-md', header: 'rounded-t-md' },
  lg: { container: 'rounded-lg', header: 'rounded-t-lg' },
  xl: { container: 'rounded-xl', header: 'rounded-t-xl' },
  '2xl': { container: 'rounded-2xl', header: 'rounded-t-2xl' },
  '3xl': { container: 'rounded-3xl', header: 'rounded-t-3xl' },
} as const;

export type ModalCardProps = {
  title?: string;
  onClose?: () => void;
  onFloatingClose?: () => void;
  onMinimize?: () => void;
  allowOverflow?: boolean;
  children: React.ReactNode;
  size?: keyof typeof MAP_CONTAINER_SIZE_CLASSNAME;
  theme?: keyof typeof MAP_HEADER_THEME_CLASSNAMES;
  roundedSize?: keyof typeof MAP_BORDER_RADIUS_CLASSNAME;
};

const ModalCard = ({
  title,
  onClose,
  children,
  size = 'md',
  roundedSize = 'lg',
  onMinimize,
  theme = 'primary',
  allowOverflow = false,
}: ModalCardProps) => {
  const showHeader = useMemo(
    () => !!(title ?? onClose ?? onMinimize) && theme !== 'float',
    [title, onClose, onMinimize, theme]
  );
  return (
    <div
      className={cn(
        'absolute inset-0 m-auto h-max w-full',
        MAP_CONTAINER_SIZE_CLASSNAME[size]
      )}
    >
      {theme === 'float' && typeof onClose === 'function' && (
        <div className="relative w-full">
          <button
            type="button"
            className="absolute right-0 top-0 grid h-8 w-8 -translate-y-1/4 translate-x-1/4 place-items-center rounded-full border bg-white shadow"
            onClick={onClose}
          >
            <FaTimes className="text-primary-800 h-4 w-4 text-3xl" />
          </button>
        </div>
      )}
      <div
        className={twMerge(
          cn(
            'flex w-full flex-col bg-white',
            MAP_BORDER_RADIUS_CLASSNAME[roundedSize].container,
            !allowOverflow ? 'overflow-hidden' : ''
          )
        )}
        style={{ height: 'max-content' }}
      >
        {showHeader && (
          <header
            className={cn(
              'flex rounded-t-lg p-6',
              MAP_HEADER_THEME_CLASSNAMES[theme],
              MAP_BORDER_RADIUS_CLASSNAME[roundedSize].header
            )}
          >
            <>
              {title && (
                <h2 className="text-base font-semibold leading-[1.125rem] text-white">
                  {title}
                </h2>
              )}
              <div className="ml-auto flex space-x-2">
                {onMinimize && (
                  <button type="button" onClick={onMinimize}>
                    <FaMinus className="text-white" />
                  </button>
                )}
                {onClose && (
                  <button type="button" onClick={onClose}>
                    <FaTimes className="text-white" />
                  </button>
                )}
              </div>
            </>
          </header>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default ModalCard;
