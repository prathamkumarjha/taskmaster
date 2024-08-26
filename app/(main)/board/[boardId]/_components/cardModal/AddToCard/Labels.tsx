import { Button } from "@/components/ui/button";
import { MdLabel } from "react-icons/md";

export const Labels = () => {
  return (
    <div>
      <Button className="bg-gray-600 text-md mt-2  pt-0 pb-0">
        <MdLabel className="mr-1" /> Labels
      </Button>
    </div>
  );
};
