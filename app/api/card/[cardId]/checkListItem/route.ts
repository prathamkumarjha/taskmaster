import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { todo } from "node:test";

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

    const{taskName,  checkListId} = body;
    console.log(body);

    try{
     const todo =     await prismadb.todo.create({
            data:{
              name:taskName,
              done: false,
              checkListId: checkListId
            } 
          })
        
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
    

    try{
     const todo =     await prismadb.todo.update({
        where:{
            todoId:todoId
        },
            data:{
              done: checked,
            } 
          })
        
          return NextResponse.json(todo,{status:200})
      
    }
    catch(error){
        console.log("unable to update the todo")
        return new NextResponse("Internal error", {status:500})
    }
   
}