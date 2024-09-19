import { BoardModal } from "@/app/(main)/dashboard/_components/boards-modal";
import BoardModalProvider from "./dashboard/_components/board-modal-provider";
import Nav from "./dashboard/_components/navbar";
import NavProvider from "./dashboard/_components/navbarProvider";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    // overflow-y-hidden min-h-screen
    <div className="bg-custom-blue h-screen overflow-hidden">
      <Nav />
      {/* <div className="w-full bg-black bg-opacity-75 h-10"></div> */}
      <BoardModalProvider />
      {children}
    </div>
  );
}
