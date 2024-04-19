import { ReactNode } from 'react';

import { cn } from '@/utils';

type Props = {
  pageTitle?: string;
  pageDescription?: string;
  children: ReactNode;
  containerClassName?: string;
};

const PageWrapper = ({
  children,
  pageTitle,
  pageDescription,
  containerClassName,
}: Props) => {
  return (
    <div
      className={cn(
        'flex flex-col space-y-5 px-4 py-2 sm:h-full sm:px-10 sm:py-6',
        containerClassName
      )}
    >
      {(Boolean(pageTitle) || Boolean(pageDescription)) && (
        <div className="flex flex-col space-y-[0.375rem] ">
          {Boolean(pageTitle) && (
            <h1 className="text-2xl font-semibold">{pageTitle}</h1>
          )}
          {Boolean(pageDescription) && (
            <p className="text-sm leading-4 text-subtle">{pageDescription}</p>
          )}
        </div>
      )}
      <div className="flex flex-col sm:h-0 sm:flex-grow">{children}</div>
    </div>
  );
};
export default PageWrapper;