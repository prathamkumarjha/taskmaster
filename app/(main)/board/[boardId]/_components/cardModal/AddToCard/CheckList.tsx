import { Button } from "@/components/ui/button";
import { IoMdCheckboxOutline } from "react-icons/io";
export const CheckList = () => {
  return (
    <div>
      <Button className="bg-gray-600 text-md mt-2">
        <IoMdCheckboxOutline className="mr-1" />
        CheckList
      </Button>
    </div>
  );
};
