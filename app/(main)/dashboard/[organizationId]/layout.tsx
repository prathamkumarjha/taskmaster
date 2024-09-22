import Sidebar from "@/app/(main)/dashboard/_components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Nav from "../_components/navbar";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex text-stone-300 h-full px-24">
      <ScrollArea className="pt-20 ">
        <Sidebar />
      </ScrollArea>

      {children}
    </div>
  );
}
