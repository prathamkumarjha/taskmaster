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
  return (
    <div>
      <YourWorkspaces workspaces={board} />
    </div>
  );
}
