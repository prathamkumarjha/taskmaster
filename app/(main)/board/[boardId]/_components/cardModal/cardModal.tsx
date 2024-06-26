"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import MoveCardModalProvider from "./MoveCardModal/moveCardModalProvider";
import { useMoveCardModal } from "@/hooks/use-move-card-modal";

const CardModal = () => {
  const { id, isOpen, onClose } = useCardModal();
  const MoveCardModal = useMoveCardModal();
  const cardId = id;
  const {
    data: cardData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["card", cardId],
    queryFn: async () => {
      const response = await axios.get(`/api/card/${cardId}`);
      return response.data;
    },
    enabled: !!id,
  });
  const moveCardModalClose = useMoveCardModal().onClose;
  const close = () => {
    moveCardModalClose();
    onClose();
  };
  if (isLoading) return;
  if (isError) return <div>Error loading card data</div>;

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent className="bg-slate-700  text-white border-0">
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
            {/* <DialogDescription className="text-white"> */}
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
            {/* </DialogDescription> */}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardModal;
