import { BoardModal } from "@/app/(main)/dashboard/_components/boards-modal";
import BoardModalProvider from "./dashboard/_components/board-modal-provider";
import Nav from "./dashboard/_components/navbar";
import NavProvider from "./dashboard/_components/navbarProvider";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-grsay-900 h-screen  overflow-hidden">
      <Nav />

      <BoardModalProvider />
      {children}
    </div>
  );
}
