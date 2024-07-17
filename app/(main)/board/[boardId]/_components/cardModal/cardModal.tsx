"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import MoveCardModalProvider from "./MoveCardModal/moveCardModalProvider";
import { useMoveCardModal } from "@/hooks/use-move-card-modal";
import CardDescription from "./cardDescription";
import CommentInput from "./Comments/commentInput";
import { useStore } from "@/hooks/use-refetch-data";
import { CommentsList } from "./Comments/commentList";

const CardModal = () => {
  const { id, isOpen, onClose } = useCardModal();
  const MoveCardModal = useMoveCardModal();
  const cardId = id;

  const { refresh, setRefresh } = useStore();

  const {
    data: cardData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["card", cardId],
    queryFn: async () => {
      const response = await axios.get(`/api/card/${cardId}`);
      return response.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (refresh) {
      refetch().then(() => setRefresh(false));
    }
  }, [refresh, refetch, setRefresh]);

  const moveCardModalClose = useMoveCardModal().onClose;
  const close = () => {
    moveCardModalClose();
    onClose();
  };

  // State for description section
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  // State for comment section
  const [commentOpen, setCommentOpen] = useState(false);
  const commentRef = useRef<HTMLDivElement>(null);

  // Handle click outside for closing description and comment sections
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        descriptionRef.current &&
        !descriptionRef.current.contains(event.target as Node)
      ) {
        setDescriptionOpen(false);
      }
      if (
        commentRef.current &&
        !commentRef.current.contains(event.target as Node)
      ) {
        setCommentOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) return null;
  if (isError) return <div>Error loading card data</div>;

  console.log(cardData);
  const comments = cardData?.comments || [];
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent className="bg-slate-700 text-white border-0 overflow-y-scroll h-screen">
          <DialogHeader>
            <DialogTitle className="flex text-white">
              <Image
                draggable="false"
                alt="card svg"
                src="/trello.svg"
                width={20}
                height={20}
                className="mr-2 select-none text-white fill-white"
                style={{ filter: "invert(100%)" }}
              />
              {cardData?.name}
            </DialogTitle>
            <span className="flex items-center">
              <span className="mb-2 p-0 text-white">in list</span>
              <Button
                className="pl-2 underline text-white mt-0 pt-0"
                variant="link"
                onClick={() => {
                  MoveCardModal.onOpen();
                  console.log("button is clicked", MoveCardModal.onOpen);
                }}
              >
                {cardData?.column.name}
              </Button>
              <MoveCardModalProvider cardData={cardData} />
            </span>
            <CardDescription
              description={cardData?.description || ""}
              cardId={cardId}
            />

            <CommentInput content={comments} cardId={cardId} />
            <div className="pt-4">
              <CommentsList content={comments} />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardModal;
