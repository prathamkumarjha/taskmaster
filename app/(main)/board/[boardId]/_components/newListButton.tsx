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
  listName: z.string().min(1).max(50),
});

interface NewListButtonInterface {
  size: Number;
}

const NewListButton: React.FC<NewListButtonInterface> = ({ size }) => {
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
      listName: "",
    },
  });

  const order = size;

  function onSubmit() {
    const values = form.getValues();
    axios
      .post(`/api/newList/${params.boardId}`, { values, order })
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
        className=" bg-white bg-opacity-15 font-semibold py-4 px-4 border-0 rounded flex hover:bg-white hover:bg-opacity-100 hover:text-black transition-opacity duration-300"
        onClick={() => {
          setNewList(true);
        }}
      >
        <FaPlus className="mr-4" /> Add a list
      </Button>
    );
  }

  return (
    <div
      className="bg-white p-4 w-60 rounded-lg shadow-md "
      ref={refOne as RefObject<HTMLDivElement>}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="listName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>List Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter list title..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
          <Button
            variant="ghost"
            className="ml-2  border-black "
            onClick={() => setNewList(false)}
          >
            <HiOutlineX className="h-4 w-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewListButton;
