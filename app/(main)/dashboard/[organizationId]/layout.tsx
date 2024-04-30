import Sidebar from "@/app/(main)/dashboard/_components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Nav from "../_components/navbar";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Nav />
      <div className="flex text-stone-300">
        <div className="hidden md:block w-64 overflow-y-auto">
          <ScrollArea>
            <Sidebar />
          </ScrollArea>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex-grow">{children}</div>
        </div>
      </div>
    </div>
  );
}
