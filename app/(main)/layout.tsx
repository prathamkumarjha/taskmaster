import { BoardModal } from "@/app/(main)/dashboard/_components/boards-modal";
import BoardModalProvider from "./dashboard/_components/board-modal-provider";
import Nav from "./dashboard/_components/navbar";
import NavProvider from "./dashboard/_components/navbarProvider";
import { ProModal } from "@/components/ui/pro-modal";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" h-screen  overflow-hidden">
      <Nav />

      <BoardModalProvider />
      <ProModal />
      {children}
    </div>
  );
}
