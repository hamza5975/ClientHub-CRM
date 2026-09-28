import { ReactNode } from 'react';
import { Card, Spinner } from '@/components/ui';
import { cn } from '@/utils/cn';

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data found',
  onRowClick,
  className,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <Card
        className={cn('flex h-64 items-center justify-center', className)}
        data-icod-id="src_components_datatable_tsx_181d">
        <Spinner size="lg" data-icod-id="src_components_datatable_tsx_eb9d" />
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card
        className={cn('flex h-64 flex-col items-center justify-center gap-2', className)}
        data-icod-id="src_components_datatable_tsx_655f">
        <p
          className="text-muted-foreground"
          data-icod-id="src_components_datatable_tsx_75ff">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <Card
      className={cn('overflow-hidden', className)}
      data-icod-id="src_components_datatable_tsx_2430">
      <div
        className="overflow-x-auto"
        data-icod-id="src_components_datatable_tsx_6944">
        <table
          className="w-full text-sm"
          data-icod-id="src_components_datatable_tsx_332d">
          <thead
            className="border-b border-border bg-muted/50"
            data-icod-id="src_components_datatable_tsx_c61a">
            <tr data-icod-id="src_components_datatable_tsx_da99">
              {columns.map((col, __icodIdx0) => (<th
                key={String(col.key)}
                className={cn(
                  'px-4 py-3 text-left font-medium text-muted-foreground',
                  col.sortable && 'cursor-pointer hover:text-foreground',
                  col.className
                )}
                data-icod-id={`src_components_datatable_tsx_d344_${__icodIdx0}`}>
                {col.header}
              </th>))}
            </tr>
          </thead>
          <tbody
            className="divide-y divide-border"
            data-icod-id="src_components_datatable_tsx_58f5">
            {data.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'transition-colors hover:bg-muted/30',
                  onRowClick && 'cursor-pointer'
                )}
                data-icod-id={`src_components_datatable_tsx_8dac_${index}`}>
                {columns.map((col, __icodIdx1) => (<td
                  key={String(col.key)}
                  className={cn('px-4 py-3', col.className)}
                  data-icod-id={`src_components_datatable_tsx_9b11_${index}_${__icodIdx1}`}>
                  {col.render ? col.render(row) : String(row[col.key] ?? '')}
                </td>))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
