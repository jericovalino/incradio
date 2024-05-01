import { isEmpty } from 'lodash';
import type { ReactNode } from 'react';

type Props = {
  label: string;
  value?: ReactNode;
  isLoading?: boolean;
};

function FieldView({ label, value, isLoading = false }: Props) {
  return (
    <div className="flex flex-col items-start">
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      <div className="relative mt-2 flex w-full items-center">
        {isLoading && !value ? (
          <div className="h-5 w-full animate-pulse rounded-md bg-gray-300" />
        ) : (
          <div className="w-full bg-white text-sm leading-4 text-gray-900">
            {isEmpty(value) ? '-' : value}
          </div>
        )}
      </div>
    </div>
  );
}

export default FieldView;
