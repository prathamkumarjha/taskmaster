import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
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

  if (!newName) {
    return (
      <div className="text-lg" onClick={handleNameClick}>
        {name}
      </div>
    );
  }

  return (
    <div>
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
