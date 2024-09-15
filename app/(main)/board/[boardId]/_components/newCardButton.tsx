import React from "react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, RefObject } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { HiOutlineX } from "react-icons/hi";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import { useRouter } from "next/navigation";
const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "name cannot be empty" })
    .max(100, { message: "name is too long" }),
  columnId: z.string().min(1),
});
import { useNewCardModal } from "@/hooks/use-newCard-name";
interface NewListButtonInterface {
  columnId: string;
}

const NewCardButton: React.FC<NewListButtonInterface> = ({ columnId }) => {
  const { isOpen, onOpen, onClose } = useNewCardModal();
  const refOne = useRef<HTMLDivElement | null>(null);

  const params = useParams<{ boardId: string }>();
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleClickOutside = (e: Event) => {
    if (refOne.current && !refOne.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      columnId: columnId,
    },
  });

  function onSubmit() {
    const values = form.getValues();
    console.log(values);

    axios
      .post(`/api/newCard/${params.boardId}`, { ...values })
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch((error) => {
        console.error("Error creating new list:", error);
      });
  }

  if (!isOpen) {
    return (
      <Button
        className="bg-white w-full pt-2 text-black hover:bg-white"
        onClick={() => {
          onOpen();
        }}
      >
        <FaPlus className="mr-1 text-black " /> Add a Card
      </Button>
    );
  }

  return (
    <div
      className=" rounded-lg bg-white sticky"
      ref={refOne as RefObject<HTMLDivElement>}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 mt-4 pb-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter list title..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex ">
            <Button className="hover:bg-opacity-0">Add a card</Button>
            <Button type="submit" variant="ghost" onClick={() => onClose()}>
              <HiOutlineX className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewCardButton;
