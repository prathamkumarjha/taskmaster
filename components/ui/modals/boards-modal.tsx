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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import toast from "react-hot-toast";
import BackgroundImages from "./ui/background-images";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name of the board is required",
  }),
  imageUrl: z.string(), // Add imageUrl to form schema
});

type FormData = {
  name: string;
  imageUrl: string;
};

export const BoardModal = () => {
  const storeModal = useBoardModal();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });
  const [disabled, setDisabled] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    form.setValue("imageUrl", imageUrl);
  };

  const onSubmit: SubmitHandler<FormData> = (formData) => {
    console.log("Form Data:", formData);
  };

  return (
    <Modal
      title="Board"
      description="Create a new board"
      onClose={storeModal.onClose}
      isOpen={storeModal.isOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormItem>
            <FormLabel>Board Name</FormLabel>
            <FormControl>
              <Input placeholder="Board Name" {...form.register("name")} />
            </FormControl>
            <FormMessage />
          </FormItem>
          <input type="hidden" {...form.register("imageUrl")} />
          <FormItem>
            <FormLabel>Image URL</FormLabel>
            <FormControl>
              <BackgroundImages onImageSelect={handleImageSelect} />
            </FormControl>
            <FormMessage />
          </FormItem>
          <div className="flex justify-end space-x-4">
            <Button
              className="mt-1"
              variant="outline"
              disabled={disabled}
              onClick={storeModal.onClose}
              type="button"
            >
              Cancel
            </Button>
            <Button className="mt-1" disabled={disabled} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
