import { checkSubscription } from "@/lib/subscription";
import { Separator } from "@/components/ui/separator";

import { SubscriptionButton } from "./_components/subscription-button";
import { Button } from "@/components/ui/button";

// import { Info } from "../_components/info";

const BillingPage = async () => {
  const isPro = await checkSubscription();

  return (
    <div className="w-full mt-20">
      {/* <Info isPro={isPro} /> 
       <Separator className="my-2" /> */}
      <SubscriptionButton isPro={isPro} />
    </div>
  );
};

export default BillingPage;
