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

export interface CardInterface {
  id: string;
  columnId: string;
  name: string;
  description: string | null;
  order: number;
}

export interface Column {
  id: string;
  name: string;
  cards: CardInterface[];
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
  const [boardId, setBoardId] = useState<string>("");
  const [list, setList] = useState<string>("Select a list");
  const [listId, setListId] = useState<string>("");
  const [order, setOrder] = useState<number>(-1);
  const [openBoard, setOpenBoard] = useState<boolean>(false);
  const [openList, setOpenList] = useState<boolean>(false);
  const [openOrder, setOpenOrder] = useState<boolean>(false);
  const [columns, setColumns] = useState<Column[]>([]);
  const [initialBoardId, setInitialBoardId] = useState<string>(
    cardData.column.boardId
  );
  const [initialListId, setInitialListId] = useState<string>(cardData.columnId);

  const itemsPerPage = 7;

  // Calculate total number of pages
  const totalPages = Math.ceil(
    (columns.find((col) => col.name === list)?.cards.length ?? 0) / itemsPerPage
  );

  // Function to get orders for the current page
  const getCurrentPageOrders = (page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return (
      columns
        .find((col) => col.name === list)
        ?.cards.slice(startIndex, endIndex) || []
    );
  };

  // State to track current page
  const [currentPage, setCurrentPage] = useState(1);

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const {
    data: boardData,
    isLoading,
    isError,
  } = useQuery<Board[]>({
    queryKey: ["wholeData"],
    queryFn: fetchWholeData,
  });

  if (isLoading) return <div></div>;
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
    setOrder(-1);
    setBoardId(selectedBoard.value);
    setOpenBoard(false);
  };

  const onListSelect = (selectedList: { label: string; value: string }) => {
    setList(selectedList.label);
    setListId(selectedList.value);
    setOrder(0);
    setOpenList(false);
  };

  const onOrderSelect = (selectedOrder: number) => {
    setOrder((currentPage - 1) * itemsPerPage + selectedOrder);
    setOpenOrder(false);
  };

  const onSubmit = async () => {
    try {
      const currentColumn = columns.find((col) => col.id === listId);
      const updatedCard = {
        ...cardData,
        columnId: listId,
        order: order,
      };

      if (boardId === initialBoardId) {
        // Update within the same board

        if (cardData.columnId === listId) {
          await axios.patch(`/api/boardChanges/${initialBoardId}/cardSwap`, {
            updateableColumn: {
              cards: currentColumn?.cards.map((card, index) =>
                card.id === cardData.id
                  ? updatedCard
                  : { ...card, order: index - 1 }
              ),
            },
          });
        } else {
          const sourceColumn = boardData
            ?.find((board) => board.id === initialBoardId)
            ?.lists.find((column) => column.id === initialListId);

          const destinationColumn = columns.find((col) => col.id === listId);

          await axios
            .patch(`/api/boardChanges/${initialBoardId}/cardSwap`, {
              firstColumn: {
                cards: (sourceColumn?.cards ?? [])
                  .filter((card) => card.id !== cardData.id)
                  .map((card, index) => ({ ...card, order: index })),
              },
              secondColumn: {
                cards: [...(destinationColumn?.cards ?? []), updatedCard].map(
                  (card, index) => ({ ...card, order: index })
                ),
              },
            })
            .then(() => {
              console.log("done");
            });
        }
      } else {
        // Move to a different board
        const sourceColumn = boardData
          ?.find((board) => board.id === initialBoardId)
          ?.lists.find((column) => column.id === initialListId);

        const destinationColumn = columns.find((col) => col.id === listId);

        // Update the source column
        await axios.patch(`/api/boardChanges/${initialBoardId}/cardSwap`, {
          updateableColumn: {
            cards: (sourceColumn?.cards ?? [])
              .filter((card) => card.id !== cardData.id)
              .map((card, index) => ({ ...card, order: index })),
          },
        });

        console.log("Removed card from source column");

        // Update the destination column
        await axios
          .patch(`/api/boardChanges/${boardId}/cardSwap`, {
            updateableColumn: {
              cards: [...(destinationColumn?.cards ?? []), updatedCard].map(
                (card, index) => ({ ...card, order: index })
              ),
            },
          })
          .then(() => {
            console.log("Added card to destination column");
          })

          .then(() => {
            console.log("done");
          });
      }
      onClose();
    } catch (error) {
      console.error("Error moving card:", error);
    }
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
                        <div
                          className={cn(
                            "ml-auto h-4  text-white  hover:text-black",
                            list === column.name ? "opacity-100" : "opacity-0"
                          )}
                        >
                          (current)
                        </div>
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
                disabled={order === -1}
              >
                {order !== -1 ? order + 1 : "Select the order"}
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandList className="bg-slate-800 text-white">
                  <CommandInput placeholder="Search order..." />
                  <CommandEmpty>No order found.</CommandEmpty>
                  <CommandGroup heading="Orders">
                    {getCurrentPageOrders(currentPage).map((_, index) => (
                      <CommandItem
                        key={index}
                        onSelect={() => onOrderSelect(index)}
                        className="text-sm text-white"
                      >
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4 text-white",
                            order === index + (currentPage - 1) * itemsPerPage
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
                <CommandSeparator />
                {totalPages > 1 && (
                  <div className="flex justify-center mt-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-2 py-1 mx-1 rounded-full ${
                            currentPage === page ? "bg-gray-700" : "bg-gray-600"
                          } text-white`}
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>
                )}
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-x-2 mt-4">
          <Button className="bg-blue-800 hover:bg-blue-900" onClick={onSubmit}>
            Submit
          </Button>
          <Button className="text-black bg-white hover:text-black, hover:bg-gray-200">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MoveCardModal;
