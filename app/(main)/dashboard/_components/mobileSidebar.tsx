import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GiHamburgerMenu } from "react-icons/gi";
import YourComponent from "./sidebar-content";
export default function Mobile() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button asChild className="mt-4 bg-transparent">
          <div className="text-white text-xl">
            <GiHamburgerMenu className="w-full h-full" />
          </div>
        </Button>
      </SheetTrigger>
      <div className=" flex justify-center ">
        <SheetContent
          side="left"
          className="w-[300px] bg-blue-950 text-white overflow-auto text-xl "
        >
          <YourComponent />
        </SheetContent>
      </div>
    </Sheet>
  );
}
