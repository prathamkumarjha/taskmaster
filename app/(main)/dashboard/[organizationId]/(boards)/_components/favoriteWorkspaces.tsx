"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { MdStarRate } from "react-icons/md";
import axios from "axios";
import { redirect } from "next/navigation";
import { MdOutlineStarPurple500 } from "react-icons/md";

export interface WorkspaceProps {
  id: string;
  organizationId: string;
  name: string;
  imageUrl: string;
  favorite: boolean;
}

const FavoriteWorkspaces: React.FC<{ workspaces: WorkspaceProps[] }> = ({
  workspaces,
}) => {
  if (Object.keys(workspaces).length === 0) {
    return <></>;
  }

  return (
    <div className="border-b-2 border-gray-200">
      <div className=" text-2xl font-bold m-4 text-gray-600 flex items-center">
        {/* <IoMdStarOutline  /> */}
        <MdOutlineStarPurple500 className="text-gray-600 h-8 w-8 mr-2" />
        Favorites
      </div>
      <div className="m-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-hidden">
        {workspaces.map((workspace) => (
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
      </div>
    </div>
  );
};

export default FavoriteWorkspaces;
