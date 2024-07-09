import BoardModalProvider from "../../_components/board-modal-provider";
import FavoriteWorkspaces from "./_components/favoriteWorkspaces";
import YourWorkspaces from "./_components/yourWorkspaces";
import prismadb from "@/lib/db";
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
    <div className="space-y-10">
      <FavoriteWorkspaces workspaces={favorite} />
      <YourWorkspaces workspaces={board} />
    </div>
  );
}
