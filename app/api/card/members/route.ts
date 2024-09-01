import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import {auth, clerkClient } from '@clerk/nextjs'

export async function GET(){
    const {userId, orgId} = auth();
    if (!userId || !orgId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      
      const organizationId = orgId;
    const response = await clerkClient.organizations.getOrganizationMembershipList({organizationId})
     // Extract only the relevant fields
     const simplifiedResponse = response.map((membership) => ({
      id: membership.id,
      name: membership.publicUserData?.firstName ? `${membership.publicUserData.firstName} ${membership.publicUserData.lastName}` : 'Unknown',
      imageUrl: membership.publicUserData?.imageUrl
    }));
    // console.log(simplifiedResponse)
    return NextResponse.json({simplifiedResponse})
}