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

export interface WorkspaceProps {
  id: string;
  organizationId: string;
  name: string;
  imageUrl: string;
  favorite: boolean;
}

const YourWorkspaces: React.FC<{ workspaces: WorkspaceProps[] }> = ({
  workspaces,
}) => {
  const router = useRouter();
  const boardModal = useBoardModal();
  return (
    <div draggable="false" className="mt-8">
      <div className="text-3xl flex font-bold m-4 text-gray-600">
        <IoPersonOutline className="mr-2" />
        Your workspace
      </div>
      <div className="m-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-hidden">
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
        <Button
          className="h-50 w-100 flex p-20 justify-center items-center space-2 bg-gray-800 md:w-full rounded-lg  hover:bg-gray-700 text-md"
          onClick={() => {
            console.log("cicked atleast");
            boardModal.onOpen();
            console.log(boardModal);
          }}
        >
          Create a new board
        </Button>
      </div>
    </div>
  );
};

export default YourWorkspaces;
