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

interface NewListButtonInterface {
  columnId: string;
}

const NewCardButton: React.FC<NewListButtonInterface> = ({ columnId }) => {
  const [newList, setNewList] = useState(false);
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
      setNewList(false);
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
        setNewList(false);
      })
      .catch((error) => {
        console.error("Error creating new list:", error);
      });
  }

  if (!newList) {
    return (
      <Button
        className=" bg-white hover:bg-opacity-20 font-semibold py-4 px-4 border-0 rounded flex text-black variant-ghost hover:bg-gray-500"
        onClick={() => {
          setNewList(true);
        }}
      >
        <FaPlus className="mr-1 text-black " /> Add a Card
      </Button>
    );
  }

  return (
    <div className="mt-4" ref={refOne as RefObject<HTMLDivElement>}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
            <Button type="submit">Add a card</Button>
            <Button
              variant="ghost"
              className="ml-2  border-black "
              onClick={() => setNewList(false)}
            >
              <HiOutlineX className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewCardButton;
