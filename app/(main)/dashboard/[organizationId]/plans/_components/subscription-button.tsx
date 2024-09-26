"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// import { useAction } from "@/hooks/use-action";
import { Button } from "@/components/ui/button";
// import { stripeRedirect } from "@/actions/stripe-redirect";
import { useProModal } from "@/hooks/use-pro-modal";
import axios from "axios";

interface SubscriptionButtonProps {
  isPro: boolean;
}

export const SubscriptionButton = ({ isPro }: SubscriptionButtonProps) => {
  const proModal = useProModal();

  // const { execute, isLoading } = useAction(stripeRedirect, {
  //   onSuccess: (data) => {
  //     window.location.href = data;
  //   },
  //   onError: (error) => {
  //     toast.error(error);
  //   }
  // });

  const router = useRouter();
  const onClick = async () => {
    if (isPro) {
      // execute({});
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
      }
    } else {
      proModal.onOpen();
    }
  };

  return (
    <Button
      // variant="primary"
      onClick={onClick}
      // disabled={isLoading}
      className="bg-green-500"
    >
      {isPro ? "Manage subscription" : "Upgrade to pro"}
    </Button>
  );
};
