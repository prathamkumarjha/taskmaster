"use client";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
export type User = {
  name: string;
  ImageUrl: string;
};
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Activity = {
  id: string;
  dateAndTime: string;
  user: User;
  change: string;
  boardName: string;
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed in JS
  const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of the year
  const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "pm" : "am";

  return { day: `${day}/${month}/${year}`, time: `${hours}:${minutes}${ampm}` };
};

export const columns: ColumnDef<Activity>[] = [
  {
    accessorKey: "dateAndTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date and Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateAndTime = row.getValue("dateAndTime") as string;
      return (
        <div>
          <div className=" text-bold">{formatDate(dateAndTime).day}</div>
          <div className="text-gray-400">{formatDate(dateAndTime).time}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "user",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.getValue("user") as User;

      return (
        <div className="flex items-center">
          <Image
            src={user.ImageUrl}
            height={30}
            width={30}
            alt="user image"
            className="rounded-full"
          />{" "}
          <div className="ml-2 text-md">{user.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "boardName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Board
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "change",
    header: "Change",
  },
];
