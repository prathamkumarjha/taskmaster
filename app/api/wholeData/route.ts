import prismadb from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
export async function GET(req: Request){

    if(!auth){
        return new NextResponse("unauthorized",{status:400})
    }

    const {orgId } = auth();
    if(!orgId){
        return new NextResponse("organization id required", {status:401})
}

    try{
        const data = await prismadb.board.findMany(
           {where:{
                organizationId:orgId
           },
         include:{
            lists: {
                include:{
                    cards:true
                }
            }
         }
        } 
        )
        
        //  console.log("this is supposed to be data", data)   
        return NextResponse.json(data)
          
        }
    catch (error){
        console.log(error);
        return new NextResponse("internal error ",{status:500})
    }
}