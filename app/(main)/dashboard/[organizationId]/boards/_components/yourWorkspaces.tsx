"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { MdStarRate } from "react-icons/md";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useBoardModal } from "@/hooks/use-board-modal";
import { cn } from "@/lib/utils";
interface WorkspaceProps {
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
    <div>
      <div className="text-white text-3xl font-bold m-4">Your workspace</div>
      <div className="m-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-hidden">
        {workspaces.map((workspace) => (
          <div key={workspace.id} className="relative">
            <div className="group h-48 w-72 space-2">
              <Link href={`/board/${workspace.id}`}>
                <Image
                  src={workspace.imageUrl}
                  alt={workspace.name}
                  fill
                  className="object-cover rounded-lg opacity-70 group-hover:opacity-60"
                />
              </Link>
              <div className="absolute top-0 left-0  opacity-100 transition-opacity duration-300 p-4">
                <p className="text-white text-lg font-semibold">
                  {workspace.name}
                </p>
              </div>
              <div>
                <Button
                  variant="link"
                  onClick={() => {
                    try {
                      const favorite = !workspace.favorite;

                      axios.patch(
                        `/api/${[workspace.organizationId]}/${workspace.id}`,
                        { favorite: favorite }
                      );
                    } catch (error) {
                      console.log(error);
                    } finally {
                      router.refresh();
                    }
                  }}
                  className={cn(
                    "absolute bottom-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4",
                    workspace.favorite ? "text-white" : "text-yellow"
                  )}
                >
                  <MdStarRate className="text-yellow text-2xl" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        <Button
          className="h-50 w-100 flex justify-center items-center space-2 bg-gray-800 md:w-full rounded-lg  hover:bg-gray-700 text-md"
          onClick={boardModal.onOpen}
        >
          Create a new board
        </Button>
      </div>
    </div>
  );
};

export default YourWorkspaces;
