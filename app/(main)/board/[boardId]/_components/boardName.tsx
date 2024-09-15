import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BoardNameProps {
  BoardName: string;
  id: string;
}

const formSchema = z.object({
  listName: z.string().min(1).max(50),
});

const BoardName: React.FC<BoardNameProps> = ({ BoardName, id }) => {
  const [name, setName] = useState(BoardName);
  const inputRef = useRef<HTMLInputElement>(null);
  const oldName = BoardName;
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        handleSaveName();
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [name]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSaveName = async () => {
    if (oldName === name || name.length < 1) {
      if (name.length < 1) {
        toast({
          variant: "destructive",
          title: "Board name is required",
        });
      }
      return;
    }

    const boardId = id;
    try {
      await axios.put(`/api/boardChanges/${boardId}/boardName`, { name });
      toast({
        title: "Board name updated successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating board name",
      });
    }
  };

  const handleDeleteName = async () => {
    try {
      await axios.delete(`/api/boardChanges/${id}/deleteBoard`);
    } catch (error) {
      console.log("unable to delete board", error);
    } finally {
      router.refresh();
    }
  };
  return (
    <div className="flex justify-between w-full px-4">
      <Input
        className="text-white text-lg w-full bg-opacity-0 bg-black border-0"
        placeholder="Enter new board title here..."
        value={name}
        onChange={handleInputChange}
        ref={inputRef}
      />
      <Popover>
        <PopoverTrigger>
          <Button
            variant="ghost"
            className="hover:bg-opacity-15 hover:bg-white rounded-full w-12 h-12 hover:text-white"
          >
            <BsThreeDotsVertical className="text-lg hover:text-white " />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="px-0 mr-2">
          <div className="text-lg flex justify-center border-b w-full border-gray-200">
            Board Actions
          </div>
          <Button
            className="w-full  bg-white text-black  hover:bg-gray-300 hover:bg-opacity-25"
            onClick={() => handleDeleteName()}
          >
            Delete Board
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
export default BoardName;
