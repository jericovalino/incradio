import React, {
  useRef,
  useMemo,
  Fragment,
  useEffect,
  useCallback,
} from 'react';
import {
  useForm,
  useWatch,
  type Control,
  type UseFormRegister,
} from 'react-geek-form';

import Button from './Button';
import FilterSearch from './FilterSearch';

type RenderFormatProps<TFilter extends Record<string, any>> = {
  control: Control<TFilter>;
  register: UseFormRegister<TFilter>;
  // setValue: UseFormReturn<TFilter>['setValue'];
};

type ModuleFiltersProps<TFilter extends Record<string, any>, TSetFilter> = {
  filter: TFilter;
  setFilter: TSetFilter;
  renderFormat?: ({ control }: RenderFormatProps<TFilter>) => Array<{
    element: JSX.Element;
  }>;
  searchPlaceholder?: string;
  actionElements?: JSX.Element[];
};

const ModuleFilters = <
  TFilter extends Record<string, any>,
  TSetFilter extends React.Dispatch<React.SetStateAction<TFilter>>
>({
  filter,
  setFilter,
  renderFormat,
  actionElements,
  searchPlaceholder,
}: ModuleFiltersProps<TFilter, TSetFilter>) => {
  const isFirstRenderRef = useRef(true);
  const setFilterRef = useRef(setFilter);

  /* -------------------------------------------------------------------------- */
  const { control, register, setValue } = useForm({
    // @ts-expect-error lib deep
    defaultValues: filter,
  });
  const watchFilterValues = useWatch({
    control,
  });
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    setFilterRef.current(watchFilterValues as TFilter);
  }, [watchFilterValues]);
  /* -------------------------------------------------------------------------- */

  const activeFiltersMeta = useMemo(() => {
    const value = Object.keys(filter).reduce((acc, cur) => {
      const currentKeyValue = filter[cur];
      if (currentKeyValue) acc[cur] = currentKeyValue;
      return acc;
    }, {} as Record<string, any>);
    return {
      count: Object.keys(value).length,
      value,
    };
  }, [filter]);

  const clearAllFilters = useCallback(() => {
    Object.keys(filter).forEach((key: any) => {
      setValue(key, '' as any);
    });
  }, [filter, setValue]);

  return (
    <section>
      <div className="flex space-x-2 @container">
        <FilterSearch
          name="keyword"
          control={control}
          placeholder={searchPlaceholder}
        />
        <div className="hidden flex-grow space-x-2 @2xl:flex">
          {renderFormat?.({ control, register }).map((f, i) => (
            <Fragment key={i}>{f.element}</Fragment>
          ))}
        </div>
        {Boolean(actionElements) && (
          <div className="!ml-auto flex space-x-1">
            {actionElements!.map((el, i) => (
              <Fragment key={i}>{el}</Fragment>
            ))}
          </div>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between rounded-[0.38rem] border p-3">
        <div className="flex flex-grow space-x-1">
          {!activeFiltersMeta.count ? (
            <p className="text-xs leading-[0.875rem] text-subtle">
              No filters added
            </p>
          ) : (
            <>
              {Object.keys(activeFiltersMeta.value).map((key) => (
                <p
                  key={key}
                  className="text-xs leading-[0.875rem] text-subtle [&:not(:last-of-type)]:mr-1 [&:not(:last-of-type)]:border-r-2 [&:not(:last-of-type)]:pr-2"
                >
                  {key} is{' '}
                  <span className="font-medium">
                    {activeFiltersMeta.value[key]}
                  </span>
                </p>
              ))}
            </>
          )}
        </div>
        <Button style="text" onClick={clearAllFilters}>
          Clear Filters
        </Button>
      </div>
    </section>
  );
};

export default ModuleFilters;
