import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) return new NextResponse("Unauthorized", { status: 401 });

  const { cardId } = params;

  if (!cardId) return new NextResponse("Card ID is required", { status: 400 });

  const body = await req.json();
  console.log(body);
  const {  labelName, selectedColor } = body;

  if (!selectedColor) {
    return new NextResponse("User ID and User Name are required", { status: 400 });
  }

  try {
    let newLabel ;
    if(!labelName){
        newLabel = await prismadb.colorOnCard.create({
            data: {
              cardId: cardId,
              color: selectedColor,
            },
          });
    }
    else {
        newLabel = await prismadb.colorOnCard.create({
            data: {
              cardId: cardId,
              color: selectedColor,
              name: labelName,
            },
          });
    }
    

    return NextResponse.json(newLabel, { status: 201 });
  } catch (error) {
    console.error("Error adding label to card:", error);
    return new NextResponse("Failed to add label to card", { status: 500 });
  }
}



export async function DELETE(
  req: Request,
  { params }: { params: { cardId: string } }
) {
  const { userId, orgId } = auth();

  if (!userId || !orgId) return new NextResponse("Unauthorized", { status: 401 });

  const { cardId } = params;

  if (!cardId) return new NextResponse("Card ID is required", { status: 400 });

  const body = await req.json();
  const { id } = body;

  if (!id) {
    return new NextResponse("Color ID is required", { status: 400 });
  }

  try {
    const deleted = await prismadb.colorOnCard.delete({
      where: {
        id: id // Prisma expects the unique identifier for deletion
      }
    });
    return NextResponse.json(deleted, { status: 200 });
  } catch (error) {
    console.error("Error deleting label:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
