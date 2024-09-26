import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GiHamburgerMenu } from "react-icons/gi";
import YourComponent from "./sidebar-content";
export default function Mobile() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button asChild className="mt-4 bg-transparent bg-black m-2">
          <div className="text-white text-xl ">
            <GiHamburgerMenu className="w-full h-full text-gray-100" />
          </div>
        </Button>
      </SheetTrigger>
      <div className=" flex justify-center ">
        <SheetContent
          side="left"
          className="w-[300px] bg-white text-black overflow-auto text-xl border-0"
        >
          <YourComponent />
        </SheetContent>
      </div>
    </Sheet>
  );
}
