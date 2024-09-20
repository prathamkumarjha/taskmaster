import Sidebar from "@/app/(main)/dashboard/_components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Nav from "../_components/navbar";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex text-stone-300 bg-custom-blue  h-full ">
      <ScrollArea className="pt-20 border-r border-blue-900 shadow-lg shadow-blue-900 ">
        <Sidebar />
      </ScrollArea>

      {children}
    </div>
  );
}
