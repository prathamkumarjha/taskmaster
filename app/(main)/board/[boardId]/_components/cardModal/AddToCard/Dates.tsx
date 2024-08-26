import { Button } from "@/components/ui/button";
import { CiClock2 } from "react-icons/ci";

export const Dates = () => {
  return (
    <div>
      <Button className="bg-gray-600 text-md mt-2">
        <CiClock2 className="mr-1  text-lg" />
        Dates
      </Button>
    </div>
  );
};
