import { Button } from '../input_controls';
import './Table.css';

type TGenericTable = <
  TData extends {
    [x: string | number]: any;
  },
  TFormat extends {
    label: string;
    key: keyof TData;
    render?: (row: TData, index: number) => React.ReactNode;
  }
>(props: {
  format: TFormat[];
  data: TData[];
  hideHead?: boolean;
  isLoading?: boolean;
  emptyListLabel?: string;
  tableTitle?: string;
  isFetching?: boolean;
  hasLoadMoreBtn?: boolean;
  onLoadMoreClicked?: () => void;
}) => React.ReactElement;

const Table: TGenericTable = function ({
  data,
  format,
  hideHead = false,
  isLoading = false,
  emptyListLabel = 'No Data Found',
  tableTitle,
  isFetching = false,
  hasLoadMoreBtn = false,
  onLoadMoreClicked,
}) {
  return (
    <div className="hide-scrollbar relative h-full max-h-full w-full overflow-auto rounded-[0.25rem] border bg-interface">
      <div className="table-container">
        {tableTitle && <caption>{tableTitle}</caption>}
        <table>
          {!hideHead && (
            <thead className="sticky top-0 z-[1] ">
              <tr>
                {format.map((col, i) => {
                  const key = i;
                  return (
                    <th
                      className={
                        'bg-gray-100 px-4 py-[0.875rem] text-left text-xs font-bold uppercase leading-[0.875rem] tracking-[0.0225rem]'
                      }
                      key={key}
                    >
                      {col.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
          )}
          <tbody>
            {isLoading &&
              data.length === 0 &&
              [0, 1, 2].map((x) => (
                <tr key={x} className="hover:bg-gray-100 focus:bg-gray-100">
                  {format.map((_, i) => {
                    return (
                      <td key={i} className={'px-4 py-[0.625rem]'}>
                        <span className="inline-block h-4 w-full animate-pulse rounded-md bg-gray-100" />
                      </td>
                    );
                  })}
                </tr>
              ))}
            {!isLoading && data.length === 0 && (
              <tr className="text-center">
                <td className="py-3" colSpan={format.length}>
                  <p className="text-sm font-semibold text-slate-600">
                    {emptyListLabel}
                  </p>
                </td>
              </tr>
            )}
            {data.length >= 1 &&
              data.map((row, i) => {
                const rowKey = i;
                return (
                  <tr
                    key={rowKey}
                    className="hover:bg-gray-100 focus:bg-gray-100"
                  >
                    {format.map((col, j) => {
                      const colKey = j;
                      return (
                        <td
                          data-cell={`${col.label}:`}
                          key={`${rowKey}-${colKey}`}
                          className={'px-4 py-[0.625rem] text-sm leading-4'}
                        >
                          <div className="flex h-full w-full flex-col justify-center">
                            {typeof col?.render === 'function'
                              ? col.render(row, i)
                              : row[col.key]}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
          {hasLoadMoreBtn && (
            <caption className="border-t p-1">
              <Button
                size="small"
                className="w-full"
                onClick={() => {
                  if (typeof onLoadMoreClicked === 'function')
                    onLoadMoreClicked();
                }}
                disabled={isFetching}
              >
                Load More...
              </Button>
            </caption>
          )}
        </table>
      </div>
    </div>
  );
};

export default Table;
