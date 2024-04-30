import { BoardModal } from "@/app/(main)/dashboard/_components/boards-modal";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-custom-blue min-h-screen  overflow-y-hidden ">
      <BoardModal />
      {children}
    </div>
  );
}
