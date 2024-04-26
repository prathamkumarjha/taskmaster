import Nav from "./dashboard/_components/navbar";
import { BoardModal } from "@/app/(main)/dashboard/_components/boards-modal";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <BoardModal />
      {children}
    </>
  );
}
