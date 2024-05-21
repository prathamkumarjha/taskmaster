import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMoveCardModal } from "@/hooks/use-move-card-modal";
import { CardModalProviderProps } from "./moveCardModalProvider";
import { useQuery } from "@tanstack/react-query";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface card {
  id: string;
  name: string;
  card: string;
}

export interface Column {
  id: string;
  name: string;
  cards: [];
}

export interface Board {
  id: string;
  name: string;
  lists: Column[];
}

const fetchWholeData = async (): Promise<Board[]> => {
  const response = await axios.get(`/api/wholeData`);
  if (response.status !== 200) {
    throw new Error("Error fetching data");
  }
  return response.data;
};

const MoveCardModal: React.FC<CardModalProviderProps> = ({ cardData }) => {
  const { isOpen, onClose } = useMoveCardModal();
  const modalRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [board, setBoard] = useState<string>("Select a board");
  const [list, setList] = useState<string>("Select a list");
  const [order, setOrder] = useState<number>();
  const [openBoard, setOpenBoard] = useState<boolean>(false);
  const [openList, setOpenList] = useState<boolean>(false);
  const [openOrder, setOpenOrder] = useState<boolean>(false);
  const [columns, setColumns] = useState<Column[]>([]);

  const {
    data: boardData,
    isLoading,
    isError,
  } = useQuery<Board[]>({
    queryKey: ["wholeData"],
    queryFn: fetchWholeData,
  });

  console.log(boardData);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading card data</div>;
  if (!isOpen) return null;

  const boards = boardData?.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentBoard = boards?.find(
    (item) => item.value === cardData.column.boardId
  );

  const onBoardSelect = (selectedBoard: { label: string; value: string }) => {
    setBoard(selectedBoard.label);

    const boardIndex = boardData?.find(
      (item) => item.id === selectedBoard.value
    );

    if (boardIndex) {
      setColumns(boardIndex.lists);
    }

    setList("");
    setOrder(undefined);
  };

  const onListSelect = (selectedList: { label: string; value: string }) => {
    setList(selectedList.label);
    setOrder(undefined);
  };

  const onOrderSelect = (selectedOrder: number) => {
    setOrder(selectedOrder);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50">
      <div
        className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-lg shadow-lg text-center shadow-slate-900 bg-slate-800"
        ref={modalRef}
      >
        <div className="flex justify-between">
          <div className="text-lg mb-4 text-white">Move Card</div>
          <RxCross1
            className="text-white w-3 cursor-pointer"
            onClick={onClose}
          />
        </div>
        <div ref={popoverRef}>
          <Popover open={openBoard} onOpenChange={setOpenBoard}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                role="combobox"
                aria-expanded={openBoard}
                aria-label="Select a board"
                className="w-[200px] justify-between bg-slate-700 text-white hover:bg-slate-800 hover:text-white border-0"
              >
                {board}
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandList className="bg-slate-800 text-white">
                  <CommandInput placeholder="Search board..." />
                  <CommandEmpty>No board found.</CommandEmpty>
                  <CommandGroup heading="Boards">
                    {boards?.map((board) => (
                      <CommandItem
                        key={board.value}
                        onSelect={() => onBoardSelect(board)}
                        className="text-sm text-white"
                      >
                        {board.label}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4 text-white",
                            currentBoard?.value === board.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
                <CommandSeparator />
              </Command>
            </PopoverContent>
          </Popover>
          <Popover open={openList} onOpenChange={setOpenList}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                role="combobox"
                aria-expanded={openList}
                aria-label="Select a list"
                className="w-[200px] justify-between bg-slate-700 text-white hover:bg-slate-800 hover:text-white border-0 mt-4"
                disabled={!columns.length}
              >
                {list || "Select a list"}
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandList className="bg-slate-800 text-white">
                  <CommandInput placeholder="Search list..." />
                  <CommandEmpty>No list found.</CommandEmpty>
                  <CommandGroup heading="Lists">
                    {columns.map((column) => (
                      <CommandItem
                        key={column.id}
                        onSelect={() =>
                          onListSelect({ label: column.name, value: column.id })
                        }
                        className="text-sm text-white"
                      >
                        {column.name}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4 text-white",
                            list === column.name ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
                <CommandSeparator />
              </Command>
            </PopoverContent>
          </Popover>
          <Popover open={openOrder} onOpenChange={setOpenOrder}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                role="combobox"
                aria-expanded={openOrder}
                aria-label="Select an order"
                className="w-[200px] justify-between bg-slate-700 text-white hover:bg-slate-800 hover:text-white border-0 mt-4"
                disabled={list === "Select a list"}
              >
                {order !== undefined ? order + 1 : "Select the order"}
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandList className="bg-slate-800 text-white">
                  <CommandInput placeholder="Search order..." />
                  <CommandEmpty>No order found.</CommandEmpty>
                  <CommandGroup heading="Orders">
                    {columns
                      .find((col) => col.name === list)
                      ?.cards.map((_, index) => (
                        <CommandItem
                          key={index}
                          onSelect={() => onOrderSelect(index)}
                          className="text-sm text-white"
                        >
                          {index + 1}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4 text-white",
                              order === index ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    {columns.find((col) => col.name === list) && (
                      <CommandItem
                        onSelect={() =>
                          onOrderSelect(
                            columns.find((col) => col.name === list)?.cards
                              .length ?? 0
                          )
                        }
                        className="text-sm text-white"
                      >
                        {(columns.find((col) => col.name === list)?.cards
                          .length ?? 0) + 1}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4 text-white",
                            order ===
                              (columns.find((col) => col.name === list)?.cards
                                .length ?? -1)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    )}
                  </CommandGroup>
                </CommandList>
                <CommandSeparator />
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-x-2">
          <Button className="text-black bg-white hover:text-black, hover:bg-gray-200">
            cancel
          </Button>
          <Button className="mt-4 ml-0">Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default MoveCardModal;
