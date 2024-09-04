"use client";

import { FaTrashAlt } from "react-icons/fa";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useCardModal } from "@/hooks/use-card-modal";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import MoveCardModalProvider from "./MoveCardModal/moveCardModalProvider";
import { useMoveCardModal } from "@/hooks/use-move-card-modal";
import CardDescription from "./cardDescription";
import CommentInput from "./Comments/commentInput";
import { useStore } from "@/hooks/use-refetch-data";
import { CommentsList } from "./Comments/commentList";
import { AddToCard } from "./AddToCard/AddToCard";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import CheckList, { CheckListInterface } from "./checklist";

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
      const target = event.target as Element; // Assert as Element

      if (descriptionRef.current && !descriptionRef.current.contains(target)) {
        setDescriptionOpen(false);
      }
      if (commentRef.current && !commentRef.current.contains(target)) {
        setCommentOpen(false);
      }
      if (
        !target.closest(".modal-content") &&
        !target.closest(".modal-overlay")
      ) {
        close();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [close]);

  if (isLoading) return null;
  if (isError) return <div>Error loading card data</div>;

  //json for image Animated tootltip
  const people = cardData?.members.map((member: any) => ({
    id: member.member.userId,
    name: member.member.userName,
    designation: member.memberDesignation,
    image: member.member.imageUrl,
  }));

  const comments = cardData?.comments || [];

  const onDelete = async (id: string) => {
    try {
      await axios.delete(`/api/card/${cardId}/label`, {
        data: { id },
      });
      // Optionally handle success here
    } catch (error) {
      console.error("Error deleting label:", error);
      // Optionally handle error here
    } finally {
      setRefresh(true);
    }
  };

  console.log(cardData);
  console.log(cardData?.checklists);

  return (
    <>
      {isOpen && (
        <div>
          {/* Modal Overlay */}
          <div className=" inset-0 bg-black/50 z-40 " onClick={close} />
          {/* Modal Content */}
          <div className=" fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
            <div className="bg-gray-800 text-white w-full max-w-lg h-auto rounded-lg shadow-lg overflow-hidden modal-content mt-24 mb-8">
              <div className="p-6">
                <div className="flex items-center justify-between border-b border-gray-600 pb-4">
                  <div>
                    <div className="flex items-center text-white p-0">
                      <Image
                        draggable="false"
                        alt="card svg"
                        src="/trello.svg"
                        width={20}
                        height={20}
                        className="mr-2"
                        style={{ filter: "invert(100%)" }}
                      />
                      <span className="text-lg font-semibold">
                        {cardData?.name}
                      </span>
                    </div>
                    <Button
                      className="text-blue-400 hover:text-blue-300 h-0 p-2"
                      variant="link"
                      onClick={() => {
                        MoveCardModal.onOpen();
                        console.log("button is clicked", MoveCardModal.onOpen);
                      }}
                    >
                      {cardData?.column.name}
                    </Button>
                  </div>
                </div>

                {cardData.colors.length == 0 ? (
                  <></>
                ) : (
                  <div>
                    Labels
                    <div className="h-20 border-2 border-gray-900 shadow-inner  shadow-black">
                      <ScrollArea className="h-full flex items-center justify-center">
                        <div className="flex space-x-2 mt-4  px-2">
                          {cardData.colors.map((color: any) => (
                            <div key={color.id}>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    // key={color.id}

                                    className={`h-8 min-w-20 rounded-lg bg-${color.color} hover:bg-${color.color} hover:opacity-70 flex justify-center items-center overflow-hidden p-2 cursor-pointer`}
                                  >
                                    <span className="truncate">
                                      {color.name}
                                    </span>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="bg-gray-900 p-4 z-[110] rounded-lg shadow-md space-y-2 ">
                                  <div className="text-lg flex justify-center">
                                    {color.name}
                                  </div>
                                  <Button
                                    variant="destructive"
                                    onClick={() => onDelete(color.id)}
                                  >
                                    <FaTrashAlt className="text-white mr-2" />
                                    Delete
                                  </Button>
                                </PopoverContent>
                              </Popover>
                            </div>
                          ))}
                          <ScrollBar orientation="horizontal" />
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                )}

                <MoveCardModalProvider cardData={cardData} />
                <div className="mt-4">
                  <div className="space-y-2">
                    Members
                    <div className="flex flex-row items-center ml-4  w-full">
                      <AnimatedTooltip items={people} />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <div className="w-full">
                      <CardDescription
                        description={cardData?.description || ""}
                        cardId={cardId}
                      />
                    </div>
                    <AddToCard cardId={cardId} members={people} />
                  </div>
                  {cardData.checklists?.map((checklist: CheckListInterface) => (
                    <CheckList
                      key={checklist.checkListId}
                      checkList={checklist}
                    />
                  ))}

                  <div className="mt-6">
                    <CommentInput
                      content={comments}
                      cardId={cardId}
                      commentId=""
                    />
                    <div className="overflow-y-auto max-h-80 mt-4">
                      <CommentsList content={comments} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CardModal;
