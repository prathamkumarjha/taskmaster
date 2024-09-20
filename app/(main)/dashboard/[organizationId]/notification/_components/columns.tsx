"use client";
import { ColumnDef } from "@tanstack/react-table";

export type User = {
  name: string;
  email: string;
};

export type Activity = {
  id: string;
  dateAndTime: string;
  user: string;
  change: string;
  boardName: string;
};

export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "dateAndTime",
    header: "Date and Time",
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.getValue("user") as String;

      return (
        <div>
          <div>{user}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "boardName",
    header: "Board",
  },
  {
    accessorKey: "change",
    header: "Change",
  },
];
