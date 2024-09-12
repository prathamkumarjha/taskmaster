import { BoardModal } from "@/app/(main)/dashboard/_components/boards-modal";
import BoardModalProvider from "./dashboard/_components/board-modal-provider";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    // overflow-y-hidden min-h-screen
    <div className="bg-custom-blue min-h-screen  ">
      <BoardModalProvider />
      {children}
    </div>
  );
}
