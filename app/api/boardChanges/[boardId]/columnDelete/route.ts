import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function DELETE(
  req: Request,
  { params }: { params: { boardId: string } }
) {
  try {
    const { userId, orgId } = auth();

    // Parse the query params from the request URL
    const { searchParams } = new URL(req.url);
    const columnId = searchParams.get("columnId");

    // Check if user is authenticated
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    // Check for required columnId
    if (!columnId) {
      return new NextResponse("Column ID is required", { status: 400 });
    }

    // Optionally validate boardId or user permissions
    if (!params.boardId) {
      return new NextResponse("Board ID is required", { status: 400 });
    }

    // Perform the deletion
    await prismadb.list.delete({
      where: {
        id: columnId,
      },
    });

    return new NextResponse("Column deleted successfully", { status: 200 });

  } catch (error) {
    console.error("Error deleting column:", error);
    return new NextResponse(`Internal Server Error`, { status: 500 });
  }
}
