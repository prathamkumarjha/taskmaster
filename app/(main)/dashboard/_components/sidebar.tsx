"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useOrganizationList } from "@clerk/nextjs";
import Image from "next/image";
// import { Organization } from "@clerk/nextjs/server";
const Sidebar = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (!userMemberships) {
    return null;
  }
  // memberships.data?.map((values) => {
  //   console.log("membership data", values.organization.name);
  // });

  // console.log(
  //   userMemberships.data?.map((member) => {
  //     console.log(member.organization.name);
  //   })
  // );
  return (
    <div className="w-56 bg-gray-800 h-screen border-inherit hidden justify-center ml-6 mt-8 sm:flex">
      <div className="py-4 px-8 text-white">
        <h1 className="text-2xl font-semibold">Workspaces</h1>
        {userMemberships?.data?.map((membership) => (
          <div key={membership.id}>
            <Accordion type="single" collapsible className="pt-4">
              <AccordionItem value={membership.id}>
                <AccordionTrigger>
                  <div className="flex items-center">
                    <div className="rounded-full overflow-hidden mr-4">
                      <Image
                        alt="organization logo"
                        src={membership.organization.imageUrl}
                        width={50}
                        height={40}
                      />
                    </div>
                    <span>{membership.organization.name}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
