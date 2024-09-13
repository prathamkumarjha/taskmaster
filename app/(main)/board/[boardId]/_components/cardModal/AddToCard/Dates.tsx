"use client";
import { Button } from "@/components/ui/button";
import { CiClock2 } from "react-icons/ci";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useState, useRef, useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
const FormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
});
import { useStore } from "@/hooks/use-refetch-data";

export const Dates = ({
  cardId,
  currentDate,
}: {
  cardId: string;
  currentDate?: string;
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleButtonClick = () => {
    setIsOpen((prev) => !prev);
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await axios.put(`/api/card/${cardId}/Date`, { date: data });
    } catch (error) {
      console.log("date update failed", error);
    } finally {
      setRefresh(true);
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(`/api/card/${cardId}/Date`);
    } catch (error) {
      console.log("unable to remove date from the card", error);
    } finally {
      setRefresh(true);
    }
  };
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

  const { refresh, setRefresh } = useStore();

  const datePickerModal = (
    <div
      ref={modalRef}
      className="absolute space-y-2 bg-gray-800 shadow-lg rounded-lg z-[101] w-70 text-white p-4 shadow-stone-900 justify-center"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Dates</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal bg-gray-600  hover:bg-gray-700 hover:text-gray-300",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : currentDate ? (
                          currentDate
                        ) : (
                          <span className="text-white">Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>choose a date for your card</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
          <Button
            type="button"
            variant="destructive"
            className="ml-2"
            onClick={() => onDelete()}
          >
            Delete
          </Button>
        </form>
      </Form>
    </div>
  );
  return (
    <div className="space-y-2">
      <Button
        ref={buttonRef}
        className="bg-gray-600 text-md mt-2 w-full"
        onClick={handleButtonClick}
      >
        <CiClock2 className="mr-1  text-lg" />
        Dates
      </Button>
      {isOpen && datePickerModal}
    </div>
  );
};
