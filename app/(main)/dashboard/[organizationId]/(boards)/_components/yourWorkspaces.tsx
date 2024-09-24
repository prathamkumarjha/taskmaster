"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { MdStarRate } from "react-icons/md";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useBoardModal } from "@/hooks/use-board-modal";
import { cn } from "@/lib/utils";
import { IoPersonOutline } from "react-icons/io5";
import { MAX_FREE_BOARDS } from "@/constants/boards";
import { getAvailableCount } from "@/lib/orgLimit";
import { useProModal } from "@/hooks/use-pro-modal";

export interface WorkspaceProps {
  id: string;
  organizationId: string;
  name: string;
  imageUrl: string;
  favorite: boolean;
}

const YourWorkspaces: React.FC<{
  workspaces: WorkspaceProps[];
  availableCount: number;
}> = ({ workspaces, availableCount }) => {
  const router = useRouter();
  const boardModal = useBoardModal();
  const proModal = useProModal();
  // const availableCount  = getAvailableCount();
  return (
    <div draggable="false" className="mt-8 w-full">
      <div className="text-3xl flex font-bold m-4 text-gray-600">
        <IoPersonOutline className="mr-2" />
        Your workspace
      </div>
      <div className="m-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-hidden items-center">
        {workspaces.map((workspace) => (
          // <div key={workspace.id} className="relative">
          //   <div className="group h-48 w-72 space-2">
          //     <Link href={`/board/${workspace.id}`}>
          //       <Image
          //         src={workspace.imageUrl}
          //         alt={workspace.name}
          //         fill
          //         className="object-cover rounded-lg bg-black-30"
          //       />
          //     </Link>
          //     <div className="absolute top-0 left-0  opacity-100 transition-opacity duration-300 p-4">
          //       <p className="text-white text-lg font-semibold">
          //         {workspace.name}
          //       </p>
          //     </div>
          //     <div>
          //       <Button
          //         variant="link"
          //         onClick={() => {
          //           try {
          //             const favorite = !workspace.favorite;

          //             axios.patch(
          //               `/api/${[workspace.organizationId]}/${workspace.id}`,
          //               { favorite: favorite }
          //             );
          //           } catch (error) {
          //             console.log(error);
          //           } finally {
          //             router.refresh();
          //           }
          //         }}
          //         className={cn(
          //           "absolute bottom-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4",
          //           workspace.favorite ? "text-white" : "text-yellow"
          //         )}
          //       >
          //         <MdStarRate className="text-yellow text-2xl" />
          //       </Button>
          //     </div>
          //   </div>
          // </div>

          <Link
            key={workspace.id}
            href={`/board/${workspace.id}`}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
            style={{ backgroundImage: `url(${workspace.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white">
              {workspace.name}
            </p>
          </Link>
        ))}
        <div
          role="button"
          className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition text-black"
          onClick={() => {
            // console.log("cicked atleast");
            if (MAX_FREE_BOARDS - availableCount == 0) {
              proModal.onOpen();
            } else {
              boardModal.onOpen();
              // console.log(boardModal);
            }
          }}
        >
          <p className="text-sm">Create new board</p>
          <span className="text-xs">
            {MAX_FREE_BOARDS - availableCount} boards remaining
          </span>
        </div>
      </div>
    </div>
  );
};

export default YourWorkspaces;
