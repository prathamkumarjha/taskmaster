"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
// import { useAction } from "@/hooks/use-action";
// import { stripeRedirect } from "@/actions/stripe-redirect";
import { toast } from "sonner";

export const ProModal = () => {
  const proModal = useProModal();

  //   const { execute, isLoading } = useAction(stripeRedirect, {
  //     onSuccess: (data) => {
  //       window.location.href = data;
  //     },
  //     onError: (error) => {
  //       toast.error(error);
  //     }
  //   });

  //   const onClick = () => {
  //     execute({});
  //   };

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const onClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/stripe");

      const { data } = response;

      if (data?.data) {
        router.push(data.data);
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error) {
      toast.error("error in redirectiing to stripe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center">
          <Image src="/hero.svg" alt="Hero" className="object-cover" fill />
        </div>
        <div className="text-neutral-700 mx-auto space-y-6 p-6">
          <h2 className="font-semibold text-xl">
            Upgrade to Tasmaster Pro Today!
          </h2>
          <p className="text-xs font-semibold text-neutral-600">
            Explore the best of Taskmaster
          </p>
          <div className="pl-3">
            <ul className="text-sm list-disc text-neutral-600">
              <li>Unlimited boards</li>
              <li>Advanced checklists</li>
              <li>Admin and security features</li>
              <li>And more!</li>
            </ul>
          </div>
          <Button
            disabled={isLoading}
            onClick={() => onClick()}
            className="w-full"
            // variant="primary"
          >
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
