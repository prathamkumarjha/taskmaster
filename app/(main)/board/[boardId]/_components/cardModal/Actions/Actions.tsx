import { Button } from "@/components/ui/button";
import { IoCopyOutline } from "react-icons/io5";
import { FaArrowRightLong } from "react-icons/fa6";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useMoveCardModal } from "@/hooks/use-move-card-modal";
import { FaRegTrashCan } from "react-icons/fa6";
import { useStore } from "@/hooks/use-refetch-data";
import { useCardModal } from "@/hooks/use-card-modal";

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

  const copyCard = async () => {
    try {
      await axios.post(`/api/copyCard/${boardId}`, {
        cardId,
        columnId,
      });
    } catch (error) {
      console.log("an error occured while copying the card", error);
    } finally {
      router.refresh();
    }
  };

  const deleteCard = async () => {
    try {
      await axios.delete(`/api/card/${cardId}`);
    } catch (error) {
      console.log("an error occured while deleting the card", error);
    } finally {
      cardModal.onClose();
      // setRefresh(true);
      router.refresh();
    }
  };

  return (
    <div className="space-y-2 mt-4">
      <div>Actions</div>
      <Button
        className="w-full bg-gray-600 text-md"
        onClick={() => MoveCardModal.onOpen()}
      >
        <FaArrowRightLong className="text-white mr-2 text-lg" /> Move
      </Button>
      <Button
        className="w-full bg-gray-600 text-md"
        onClick={() => {
          copyCard();
        }}
      >
        <IoCopyOutline className="text-white mr-2" /> copy
      </Button>
      <Button
        className="w-full bg-gray-600 text-md"
        onClick={() => deleteCard()}
      >
        <FaRegTrashCan className="text-white mr-2" />
        Delete
      </Button>
    </div>
  );
}
