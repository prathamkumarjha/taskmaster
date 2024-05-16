"use client";
import { Modal } from "@/components/ui/modal";
import { useBoardModal } from "@/hooks/use-board-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useOrganization } from "@clerk/clerk-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { BackgroundImages } from "./background-images";
import { BoardPreview } from "./backgroundImagePreview";
import axios from "axios";
import { useBackgroundImageStore } from "@/hooks/use-BackgroundImage-store";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name of the board is required",
  }),
  imageUrl: z.string(),
});

type FormData = {
  name: string;
  imageUrl: string;
};

export const BoardModal = () => {
  const storeModal = useBoardModal();
  const router = useRouter();
  const { organization } = useOrganization();

  const organizationId = organization?.id;

  const { selectedBackground, setSelectedBackground } =
    useBackgroundImageStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });
  const { toast } = useToast();
  const [disabled, setDisabled] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    form.setValue("imageUrl", selectedBackground);
    selectedBackground == "" ? setDisabled(true) : setDisabled(false);
  }, [form, selectedBackground]);

  if (!isMounted) {
    return;
  }

  const handleImageSelect = (imageUrl: string) => {
    setSelectedBackground(imageUrl);
    form.setValue("imageUrl", imageUrl);
  };

  //sending new boards data to the backend
  const onSubmit: SubmitHandler<FormData> = (formData) => {
    try {
      setDisabled(true);
      axios.post(`/api/${organizationId}/newBoard`, formData);
    } catch (error) {
      console.log("an error occured while creating the new board", error);
      toast({
        variant: "destructive",
        description: "There was a problem with creating your board.",
      });
    } finally {
      setDisabled(false);
      toast({
        description: "new board created",
      });
      router.refresh;
    }
  };

  return (
    <Modal
      title="Create board"
      description=""
      onClose={storeModal.onClose}
      isOpen={storeModal.isOpen}
    >
      {/* BoardPreview component here */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormItem className="space-y-16 hidden md:block ">
            <BoardPreview />
          </FormItem>
          <FormItem>
            <FormLabel>Board Name</FormLabel>
            <FormControl>
              <Input
                className="text-black text-lg"
                placeholder="Board Name"
                {...form.register("name")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
          <input type="hidden" {...form.register("imageUrl")} />
          <FormItem>
            <FormLabel>Background Image</FormLabel>
            <FormControl>
              <BackgroundImages onImageSelect={handleImageSelect} />
            </FormControl>
            <FormMessage />
          </FormItem>
          <div className="flex justify-end space-x-4 text-black">
            <Button
              className="mt-1 hover:bg-black hover:text-white"
              variant="outline"
              disabled={disabled}
              onClick={storeModal.onClose}
              type="button"
            >
              Cancel
            </Button>
            <Button
              className="mt-1 hover:bg-black hover:text-white"
              variant="outline"
              disabled={disabled}
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
