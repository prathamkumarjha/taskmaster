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

const fetchWholeData = async () => {
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

  const [board, setBoard] = useState(cardData.column.board.name);
  const [list, setList] = useState(cardData.column.name);
  const [position, setPosition] = useState(cardData.order);
  const [open, setOpen] = useState(false);

  const {
    data: boardData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wholeData"],
    queryFn: fetchWholeData,
  });

  if (isLoading) return <div></div>;
  if (isError) return <div>Error loading card data</div>;
  if (!isOpen) return null;

  const boards = boardData.map((item: any) => ({
    label: item.name,
    value: item.id,
  }));

  const currentBoard = boards.find(
    (item: any) => item.value === cardData.column.boardId
  );

  const onBoardSelect = (board: { label: string; value: string }) => {
    setBoard(board.label);

    if (board.value === cardData.column.boardId) {
      const currentColumn = boardData.find(
        (item: any) => item.value === cardData.columnId
      );
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50">
      <div
        className="fixed top-0 left-0 right-0 bottom-0  rounded-lg"
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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                role="combobox"
                aria-expanded={open}
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
                    {boards.map((board: { value: string; label: string }) => (
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
        </div>
      </div>
    </div>
  );
};

export default MoveCardModal;
