import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs";
import { ENTITY_TYPE, ACTION } from "@prisma/client";

export async function POST (req:Request, {params}:{params:{cardId:string}}) {
    const {userId, orgId} = auth();

    if(!userId || !orgId) {
        return new NextResponse("unauthenticated",{status:400})
    }

    const cardId = params;
    if(!cardId){
        return new NextResponse("cardId required",{status:422});
    }

    const body = await req.json();
    const userData = await clerkClient.users.getUser(userId);

    const{taskName,  checkListId} = body;
    try{
     const todo =     await prismadb.todo.create({
            data:{
              name:taskName,
              done: false,
              checkListId: checkListId
            } 
          })

          try{
            const list = await prismadb.card.findUnique({
              where:{
               
                  id:params.cardId
                },
          include:{
            column:{
              include:{
                board:true
              }
            }
          }
              }
            )
          

            
        await prismadb.audit_log.create({
            data: {
              orgId:list?.column.board.organizationId!,
              boardId: list?.column.boardId!,             
              cardId: params.cardId,                         
              entityType: ENTITY_TYPE.TODO,        
              entityTitle: taskName,         
              userId: userId,                       
              userImage: userData.imageUrl,        
              userName: `${userData.firstName} ${userData.lastName}`,
              action: ACTION.CREATE,                
            },
          })

          }catch(error){
            console.log("this is error",error)
          }
         

      
        
          return NextResponse.json(todo,{status:200})
      
    }
    catch(error){
        console.log("unable to create a new todo")
        return new NextResponse("Internal error", {status:500})
    }
   
}

export async function PUT(req:Request, {params}:{params:{cardId:string}}){
    const {userId, orgId} = auth();


    if(!userId || !orgId) {
        return new NextResponse("unauthenticated",{status:400})
    }

    const cardId = params;
    if(!cardId){
        return new NextResponse("cardId required",{status:422});
    }

    const body = await req.json();

    const{todoId,checked} = body;
    
  const userData = await clerkClient.users.getUser(userId);

    try{

      const list = await prismadb.card.findUnique({
        where:{
         
            id:params.cardId
          },
    include:{
      column:{
        include:{
          board:true
        }
      }
    }
        }
      )

     const todo =  await prismadb.todo.update({
        where:{
            todoId:todoId
        },
            data:{
              done: checked,
            } 
          })

          
         prismadb.audit_log.create({
            data: {
              orgId: list?.column.board.organizationId!, 
              boardId: list?.column.boardId!,             
              cardId: params.cardId,                         
              entityType: ENTITY_TYPE.TODO,        
              entityTitle: todo.name,         
              userId: userId,                       
              userImage: userData.imageUrl,        
              userName: `${userData.firstName} ${userData.lastName}`,
              action:checked? ACTION.MARK : ACTION.UNMARK,                
            },
          })
      
        
          return NextResponse.json(todo,{status:200})
      
    }
    catch(error){
        console.log("unable to update the todo")
        return new NextResponse("Internal error", {status:500})
    }
   
}

export async function DELETE(
    req: Request,
    { params }: { params: { cardId: string } }
  ) {
    const { userId, orgId } = auth();
  
    if (!userId || !orgId) return new NextResponse("Unauthorized", { status: 401 });
  
    const { cardId } = params;
    const userData = await clerkClient.users.getUser(userId);
    if (!cardId) return new NextResponse("Card ID is required", { status: 400 });
  
    // Extract todoId from URL parameters
    const url = new URL(req.url);
    const todoId = url.searchParams.get("todoId");
  
    if (!todoId) {
      return new NextResponse("Todo ID is required", { status: 400 });
    }
  
    try {
      //get list in which the card is present to extract the board name 
      const list = await prismadb.card.findUnique({
        where:{
         
            id:params.cardId
          },
    include:{
      column:{
        include:{
          board:true
        }
      }
    }
        }
      )

      const todo = await prismadb.todo.findUnique({
        where:{
          todoId: todoId
        },
        
      })

     
      // Make sure todoId matches your schema field
      const deletedCheckList = await prismadb.todo.delete({
        where: {
          todoId: todoId, // Use 'id' if it's the actual field in your schema
        },
      });
  

        
       prismadb.audit_log.create({
        data: {
          orgId:list?.column.board.organizationId!,
          boardId: list?.column.boardId!,             
          cardId: params.cardId,                         
          entityType: ENTITY_TYPE.TODO,        
          entityTitle: todo?.name!,         
          userId: userId,                       
          userImage: userData.imageUrl,        
          userName: `${userData.firstName} ${userData.lastName}`,
          action:ACTION.DELETE,                
        },
      })

      // Return the deleted item as a response
      return NextResponse.json(deletedCheckList, { status: 200 });
    } catch (error) {
      console.error("Error deleting checklist:", error);
      return new NextResponse("Failed to delete checklist", { status: 500 });
    }
  }
  