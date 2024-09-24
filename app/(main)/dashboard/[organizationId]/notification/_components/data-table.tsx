"use client";

import * as React from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState,
  ColumnFiltersState,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Your columns definition
  data: TData[]; // The actual data
}

export function DataTable<TData, Tvalue>({
  columns,
  data,
}: DataTableProps<TData, Tvalue>) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 7 } },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    state: {
      columnFilters,
      columnVisibility,
      sorting,
    },
  });

  return (
    <div className="w-full p-8 mb-4">
      <div className="w-full p-0 flex justify-between mb-4">
        <Input
          placeholder="Filter changes..."
          value={(table.getColumn("change")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("change")?.setFilterValue(event.target.value)
          }
          className="max-w-sm text-black"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <div className="flex items-center py-4"></div> */}
      </div>
      <div className="w-full overflow-auto ">
        <div className="rounded-md border-0 w-full p-0">
          <Table className="w-full hover:bg-transparent">
            <TableHeader className="hover:bg-transparent text-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => {
                    return (
                      <TableHead
                        key={header.id}
                        // Show only first 8 columns on medium to small screens
                        className={index >= 7 ? "hidden md:table-cell" : ""}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-0 text-black hover:bg-gray-100  cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        // Show only first 8 columns on medium to small screens
                        className={index >= 8 ? "hidden md:table-cell" : ""}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 pb-4 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-gray-900 text-white border-0 hover hover:bg-gray-600 hover:text-white hover:opacity-75"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-gray-900 text-white border-0 hover hover:bg-gray-600 hover:text-white hover:opacity-75"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
