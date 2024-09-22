import BoardModalProvider from "../../_components/board-modal-provider";
import FavoriteWorkspaces from "./_components/favoriteWorkspaces";
import YourWorkspaces from "./_components/yourWorkspaces";
import prismadb from "@/lib/db";
import { OrganizationName } from "../../_components/organizationName";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";
import { Organization } from "@clerk/nextjs/server";

export default async function Page({
  params,
}: {
  params: { organizationId: string };
}) {
  const board = await prismadb.board.findMany({
    where: {
      organizationId: params.organizationId,
    },
  });

  const favorite = await prismadb.board.findMany({
    where: {
      organizationId: params.organizationId,
      favorite: true,
    },
  });

  return (
    <div className="overflow-auto p-8 mt-18 pt-20">
      <div className="pb-4">
        {/* Add some padding to avoid cutting off the content */}
        <OrganizationName />
        <FavoriteWorkspaces workspaces={favorite} />
        <YourWorkspaces workspaces={board} />
      </div>
    </div>
  );
}
