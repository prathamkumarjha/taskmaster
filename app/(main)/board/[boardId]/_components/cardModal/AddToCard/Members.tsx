"use client";
import { IoMdClose, IoMdSad } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { BsFillPeopleFill } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { useCardModal } from "@/hooks/use-card-modal";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { memberInterface } from "./AddToCard";
import { useRouter } from "next/navigation";
import { useStore } from "@/hooks/use-refetch-data";

interface Member {
  id: string;
  name: string;
  imageUrl: string;
}

const fetchMembers = async (cardId: string): Promise<Member[]> => {
  const response = await axios.get(`/api/card/members`);
  return response.data.simplifiedResponse; // Access the nested array
};

export function Members({
  cardId,
  assigned,
}: {
  cardId: string;
  assigned: memberInterface[];
}) {
  const { id: userId } = useCardModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSelectedMember, setSelectedMember] = useState("");
  const { refresh, setRefresh } = useStore();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const {
    data: members = [],
    isLoading,
    isError,
  } = useQuery<Member[]>({
    queryKey: ["card", "cardId", "members"],
    queryFn: () => fetchMembers(userId),
    enabled: !!cardId, // Ensure the query only runs when cardId is available
  });

  const router = useRouter();
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const { toast } = useToast();

  //form for adding member to any card
  const formSchema = z.object({
    userDesignation: z.string().min(1, {
      message: "username must be atleast 1 characters",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userDesignation: "",
    },
  });

  // this is an object to check which members are already added to the card
  const addedMembers: { [key: string]: boolean } = {};

  for (const member of assigned) {
    addedMembers[member.id] = true;
  }

  const onSubmit = async (
    id: string,
    imageUrl: string,
    name: string,
    designation: string
  ) => {
    try {
      await axios.post(`/api/card/${cardId}/members`, {
        id,
        userName: name,
        userImageUrl: imageUrl,
        designation,
      });

      toast({
        title: "Member added to the card",
      });
    } catch (error) {
      console.error("Failed to add person:", error);
    } finally {
      setIsFormOpen(false);
      setRefresh(true);
    }
  };

  const removeMember = async (id: string) => {
    try {
      // Making the DELETE request, with id as a query parameter
      await axios.delete(`/api/card/${cardId}/members`, {
        params: { id },
      });

      toast({
        title: "Member removed from card",
      });

      // Refresh the current route to reflect changes
      router.refresh();
    } catch (error) {
      console.error("Failed to remove person:", error);
      toast({
        title: "Error",
        description: "Failed to remove member from card.",
        variant: "destructive",
      });
    } finally {
      // router.refresh();
      setRefresh(true);
    }
  };

  const membersList = (
    <div
      ref={modalRef}
      className="absolute bg-gray-800 shadow-neutral-900 shadow-lg rounded-lg z-[101] w-80 text-white p-4 mt-2"
    >
      {isLoading && <div>Loading members...</div>}
      {isError && <div>Error loading members</div>}
      Select Members
      {members.map((member) => (
        <div key={member.id}>
          <div
            className={`flex items-center m-2  pb-2 cursor-pointer justify-between ${
              addedMembers[member.id] &&
              " shadow-gray-900 shadow-inner rounded-lg p-4 italic text-lg underline "
            } `}
            onClick={() => {
              // if the user is already added on card on click remove him else if their form is open close it or open their form
              addedMembers[member.id]
                ? removeMember(member.id)
                : member.id == isSelectedMember && isFormOpen
                ? setIsFormOpen(false)
                : setIsFormOpen(true);
              setSelectedMember(member.id);
            }}
          >
            <div className="flex overflow-auto">
              <Image
                height={32}
                width={32}
                src={member.imageUrl}
                alt={member.name}
                className="rounded-full mr-2"
              />
              <span>{member.name}</span>
            </div>
            {addedMembers[member.id] ? (
              <div>
                <IoMdClose />
              </div>
            ) : (
              ""
            )}
          </div>
          {isFormOpen && isSelectedMember == member.id && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) => {
                  const id: string = member.id;
                  const designation: string = values.userDesignation;
                  const name: string = member.name;
                  const imageUrl: string = member.imageUrl;
                  onSubmit(id, imageUrl, name, designation);
                })}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="userDesignation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-gray-600"
                          placeholder="Admin"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is users Designation in card.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
                <Button
                  className="hover:bg-red ml-2 bg-gray-600"
                  onClick={() => {
                    setIsFormOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </form>
            </Form>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <Button
        className="bg-gray-600 text-md mt-2 w-full"
        onClick={handleButtonClick}
        ref={buttonRef}
      >
        <BsFillPeopleFill className="mr-1" /> Members
      </Button>

      {isOpen && membersList}
    </div>
  );
}
