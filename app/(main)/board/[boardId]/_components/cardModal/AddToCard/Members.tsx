"use client";

import { Button } from "@/components/ui/button";
import { BsFillPeopleFill } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useCardModal } from "@/hooks/use-card-modal";
import Image from "next/image";
import { createPortal } from "react-dom";

interface Member {
  id: string;
  name: string;
  imageUrl: string;
}

const fetchMembers = async (cardId: string): Promise<Member[]> => {
  const response = await axios.get(`/api/card/members`);
  return response.data.simplifiedResponse; // Access the nested array
};

export const Members = () => {
  const { id: cardId } = useCardModal();
  const [isOpen, setIsOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const {
    data: members = [],
    isLoading,
    isError,
  } = useQuery<Member[]>({
    queryKey: ["card", cardId, "members"],
    queryFn: () => fetchMembers(cardId),
    enabled: !!cardId, // Ensure the query only runs when cardId is available
  });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      // Set modalPosition based on button's position + desired offset in rem units
      setModalPosition({
        top: rect.bottom + window.scrollY + 6, // 1.5rem below the button
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const membersList = (
    <div
      style={{
        top: modalPosition?.top ?? 0,
        left: modalPosition?.left ?? 0,
      }}
      className="absolute bg-gray-800 shadow-lg rounded-lg  z-[101] w-80 text-white p-4"
    >
      {isLoading && <div>Loading members...</div>}
      {isError && <div>Error loading members</div>}
      {members.map((member) => (
        <div key={member.id} className="flex items-center m-2 border-b-2 pb-2">
          <Image
            height={32}
            width={32}
            src={member.imageUrl}
            alt={member.name}
            className="rounded-full mr-2"
          />
          <span>{member.name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <Button
        className="bg-gray-600 text-md mt-2"
        onClick={handleButtonClick}
        ref={buttonRef}
      >
        <BsFillPeopleFill className="mr-1" /> Members
      </Button>

      {isOpen && createPortal(membersList, document.body)}
    </div>
  );
};
