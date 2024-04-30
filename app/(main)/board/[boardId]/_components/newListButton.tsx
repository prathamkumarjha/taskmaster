import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, RefObject } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  listName: z.string().min(1).max(50),
});

const NewListButton = () => {
  const [newList, setNewList] = useState(false);
  const refOne = useRef<HTMLDivElement | null>(null);

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      listName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  if (!newList) {
    return (
      <Button
        className=" bg-white bg-opacity-15 hover:bg-opacity-20 font-semibold py-2 px-4 border-0 rounded"
        onClick={() => setNewList(true)}
      >
        Add a list
      </Button>
    );
  }

  return (
    <div
      className="bg-white p-4 w-60 rounded-lg shadow-md"
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
                  <Input placeholder="Enter list here..." {...field} />
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
            X
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewListButton;
