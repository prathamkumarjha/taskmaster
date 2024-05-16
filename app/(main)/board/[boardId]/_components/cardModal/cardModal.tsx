"use client";
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
const CardModal = () => {
  const id = useCardModal().id;

  const { data: cardData } = useQuery({
    queryKey: ["card", id],
    queryFn: () => axios.get(`/api/card/${id}`),
  });

  console.log(cardData);
  return (
    <div>
      <Dialog
        open={useCardModal().isOpen}
        onOpenChange={useCardModal().onClose}
      >
        <DialogTrigger>{}</DialogTrigger>
        <DialogContent>
          <DialogTitle className="flex">
            <Image
              draggable="false"
              alt="card svg"
              src="/trello.svg"
              width={20}
              height={20}
              className="mr-2 select-none"
            />
            {cardData?.data.name}
          </DialogTitle>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardModal;
