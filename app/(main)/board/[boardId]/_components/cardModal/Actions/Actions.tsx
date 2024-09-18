import { Button } from "@/components/ui/button";
import { IoCopyOutline } from "react-icons/io5";
import { FaArrowRightLong } from "react-icons/fa6";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMoveCardModal } from "@/hooks/use-move-card-modal";
import { FaRegTrashCan } from "react-icons/fa6";
import { useStore } from "@/hooks/use-refetch-data";
import { useCardModal } from "@/hooks/use-card-modal";
import { useState } from "react";
import { useDisableStore } from "@/hooks/use-button-disable-store";

export default function Actions({
  cardId,
  columnId,
  boardId,
}: {
  cardId: string;
  columnId: string;
  boardId: string;
}) {
  const router = useRouter();
  const MoveCardModal = useMoveCardModal();
  const { refresh, setRefresh } = useStore();
  const cardModal = useCardModal();
  const { isDisabled, setDisabled } = useDisableStore();
  const copyCard = async () => {
    if (isDisabled) {
      return;
    }
    try {
      setDisabled(true);
      await axios.post(`/api/copyCard/${boardId}`, {
        cardId,
        columnId,
      });
    } catch (error) {
      console.log("an error occured while copying the card", error);
    } finally {
      setDisabled(false);
      router.refresh();
    }
  };

  const deleteCard = async () => {
    if (isDisabled) {
      return;
    }
    setDisabled(true);
    try {
      await axios.delete(`/api/card/${cardId}`);
    } catch (error) {
      console.log("an error occured while deleting the card", error);
    } finally {
      cardModal.onClose();
      // setRefresh(true);
      setDisabled(false);
      router.refresh();
    }
  };

  return (
    <div className="space-y-2 mt-4">
      <div>Actions</div>
      <Button
        disabled={isDisabled}
        className="w-full bg-gray-600 text-md"
        onClick={() => MoveCardModal.onOpen()}
      >
        <FaArrowRightLong className="text-white mr-2 text-lg" /> Move
      </Button>
      <Button
        disabled={isDisabled}
        className="w-full bg-gray-600 text-md"
        onClick={() => {
          copyCard();
        }}
      >
        <IoCopyOutline className="text-white mr-2" /> copy
      </Button>
      <Button
        disabled={isDisabled}
        className="w-full bg-gray-600 text-md"
        onClick={() => deleteCard()}
      >
        <FaRegTrashCan className="text-white mr-2" />
        Delete
      </Button>
    </div>
  );
}
