import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface CardModalNameProps {
  cardName: string;
  id: String;
}

const formSchema = z.object({
  listName: z.string().min(1).max(50),
});

const CardModalName: React.FC<CardModalNameProps> = ({ cardName, id }) => {
  const [name, setName] = useState(cardName);
  const [newName, setNewName] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const oldName = cardName;
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

  const handleSaveName = async () => {
    console.log("New name:", name);
    if (oldName == name) {
      setNewName(false);
      return;
    } else if (name.length >= 1) {
      console.log(name);
      const cardId = id;
      await axios.put(`/api/card/${cardId}`, { name: name }).then(() =>
        toast({
          title: "Card name updated sucessfully",
        })
      );
    } else {
      toast({
        variant: "destructive",
        title: "Card name is required",
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
      <div className="text-xl" onClick={handleNameClick}>
        {name}
      </div>
    );
  }

  return (
    <div>
      <Input
        className="text-black w-full"
        placeholder="Enter new card title here..."
        value={name}
        onChange={handleInputChange}
        ref={inputRef}
      />
    </div>
  );
};

export default CardModalName;
