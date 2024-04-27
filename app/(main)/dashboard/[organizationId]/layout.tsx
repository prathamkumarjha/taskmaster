import Sidebar from "@/app/(main)/dashboard/_components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className=" text-stone-300 flex">
      <div className="hidden w-64 shrink-0 md:block overflow-y-hidden">
        <ScrollArea>
          <Sidebar />
        </ScrollArea>
      </div>
      <div className="flex">{children}</div>
    </div>
  );
}
