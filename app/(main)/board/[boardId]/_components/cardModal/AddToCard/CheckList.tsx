import { Button } from "@/components/ui/button";
import { IoMdCheckboxOutline } from "react-icons/io";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useStore } from "@/hooks/use-refetch-data";

export const CheckList = ({ cardId }: { cardId: string }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { refresh, setRefresh } = useStore();

  const FormSchema = z.object({
    CheckListName: z.string().min(1, {
      message: "name of checklist must have atleast 1 character",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      CheckListName: "",
    },
  });

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

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    try {
      await axios.post(`/api/card/${cardId}/checkList`, {
        CheckListName: data.CheckListName,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setRefresh(true);
    }
  };
  const membersList = (
    <div
      ref={modalRef}
      className="absolute space-y-2 bg-gray-800 shadow-lg rounded-lg z-[101] w-80 text-white p-4 shadow-stone-900"
    >
      <div className="flex justify-center">Add to CheckList</div>
      <div className="flex justify-center w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="CheckListName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="checklist"
                      {...field}
                      className="bg-gray-600 text-white w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-red" />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );

  return (
    <div>
      <Button
        ref={buttonRef}
        className="bg-gray-600 text-md mt-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoMdCheckboxOutline className="mr-1" />
        CheckList
      </Button>
      {isOpen && membersList}
    </div>
  );
};
