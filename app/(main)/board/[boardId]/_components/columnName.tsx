import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { string, z } from "zod";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { HiDotsVertical } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNewCardModal } from "@/hooks/use-newCard-name";

interface ColumnNameProps {
  listName: string;
  id: String;
}

const formSchema = z.object({
  listName: z.string().min(1).max(50),
});

const ColumnName: React.FC<ColumnNameProps> = ({ listName, id }) => {
  const [name, setName] = useState(listName);
  const [newName, setNewName] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useNewCardModal();
  const oldName = listName;
  const router = useRouter();
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (
        newName &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        handleSaveName();
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const params = useParams();
  const handleSaveName = () => {
    console.log("New name:", name);
    if (oldName === name) {
      setNewName(false);
      return;
    } else if (name.length >= 1) {
      axios
        .patch(`/api/boardChanges/${params.boardId}/columnUpdate`, { name, id })
        .then(() =>
          toast({
            title: "List name updated sucessfully",
          })
        );
    } else {
      toast({
        variant: "destructive",
        title: "List name is required",
      });
    }
    router.refresh();
    setNewName(false);
  };

  const handleNameClick = () => {
    setNewName(true);
  };

  const onDelete = async () => {
    try {
      await axios.delete(`/api/boardChanges/${params.boardId}/columnDelete`, {
        params: {
          columnId: id, // ensure params.columnId exists in your scope
        },
      });
    } catch (error) {
      console.log("error on deleting list", error);
    } finally {
      router.refresh();
    }
  };

  console.log("boardId is", params.boardId);
  const onCopy = async () => {
    try {
      await axios.post(`/api/boardChanges/${params.boardId}/columnCopy`, {
        ListId: id,
      });
    } catch (error) {
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  if (!newName) {
    return (
      <div className="text-xl flex justify-between w-full sticky top-0 bg-white pt-2 z-10  ">
        <Badge
          onClick={handleNameClick}
          variant="secondary"
          className="bg-gray-800 text-white hover:bg-gray-700 shadow-black shadow-lg h-8"
        >
          {name}
        </Badge>
        <Popover>
          <PopoverTrigger>
            <Button variant="ghost" className="mr-0">
              <HiDotsVertical />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="px-0">
            <span className="flex justify-center border-b border-gray-200 margin-black text-md">
              List actions
            </span>
            <Button
              className="w-full px-0"
              variant="ghost"
              onClick={() => {
                onCopy();
              }}
            >
              Copy list...
            </Button>
            <Button
              className="w-full px-0"
              variant="ghost"
              onClick={() => onOpen()}
            >
              Add card...
            </Button>
            <div className="w-full  border-t flex justify-center border-gray-200">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => onDelete()}
              >
                Delete this list
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="pt-4">
      <Input
        placeholder="Enter new list title here..."
        value={name}
        onChange={handleInputChange}
        ref={inputRef}
      />
    </div>
  );
};

export default ColumnName;
