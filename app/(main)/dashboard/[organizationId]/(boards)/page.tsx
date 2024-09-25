import BoardModalProvider from "../../_components/board-modal-provider";
import FavoriteWorkspaces from "./_components/favoriteWorkspaces";
import YourWorkspaces from "./_components/yourWorkspaces";
import prismadb from "@/lib/db";
import { OrganizationName } from "../../_components/organizationName";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";
import { Organization } from "@clerk/nextjs/server";
import { getAvailableCount } from "@/lib/orgLimit";
import { checkSubscription } from "@/lib/subscription";

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

  const availableCount = await getAvailableCount();
  const isPro = await checkSubscription();

  return (
    <div className="overflow-auto m-8 mt-18 p-2 pt-20 w-full">
      <div className="pb-4">
        {/* Add some padding to avoid cutting off the content */}
        <OrganizationName />
        <FavoriteWorkspaces workspaces={favorite} />
        <YourWorkspaces
          workspaces={board}
          availableCount={availableCount}
          isPro={isPro}
        />
      </div>
    </div>
  );
}
