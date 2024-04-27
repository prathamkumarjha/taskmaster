import Nav from "./dashboard/_components/navbar";
import { BoardModal } from "@/app/(main)/dashboard/_components/boards-modal";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-custom-blue  overflow-y-hidden">
      <Nav />
      <BoardModal />
      {children}
    </div>
  );
}
