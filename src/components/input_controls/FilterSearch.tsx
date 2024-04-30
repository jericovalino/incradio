import { useCallback, useState } from 'react';
import { Control, useController } from 'react-geek-form';

import { cn } from '@/utils';

import Button from './Button';

type Props = {
  name: string;
  control: Control<any>;
  placeholder?: string;
  btnLabel?: string;
  onChange?: (value: string) => void;
};

const FilterSearch = ({
  name,
  control,
  btnLabel = 'Search',
  placeholder = 'Keyword',
}: Props) => {
  const {
    field: { ref, value, onChange },
  } = useController({
    name,
    control,
    defaultValue: '',
  });
  const [_value, _setValue] = useState(value);
  const setInnerValueToOuter = useCallback(() => {
    onChange(_value);
  }, [onChange, _value]);
  return (
    <form
      className="relative isolate flex"
      onSubmit={(e) => {
        e.preventDefault();
        setInnerValueToOuter();
      }}
    >
      <input
        id={name}
        ref={ref}
        value={_value}
        onChange={(e) => _setValue(e.target.value)}
        className={cn(
          'placeholder:text-placeholder h-[2.25rem] w-full rounded px-2 py-[0.625rem] text-sm leading-4',
          'focus:outline-none'
        )}
        placeholder={placeholder}
      />
      <div className="pointer-events-none absolute inset-0 h-full w-full rounded border" />
      <Button className="focus:z-10" onClick={setInnerValueToOuter}>
        {btnLabel}
      </Button>
    </form>
  );
};

export default FilterSearch;
