"use client";
import React from "react";
import Image from "next/image";
import { shadesOfPurple } from "@clerk/themes";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@clerk/nextjs";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { useBoardModal } from "@/hooks/use-board-modal";
import Mobile from "./mobileSidebar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/clerk-react";
import { useEffect } from "react";

export default function Nav() {
  const boardModal = useBoardModal();

  const { organization } = useOrganization();
  const organizationId = organization?.id;
  const router = useRouter();

  // useEffect(() => {
  //   if (organizationId) {
  //     router.push(`/dashboard/${[organizationId]}/boards`);
  //   }
  // }, [organizationId, router]);

  return (
    <div className="bg-white  text-black  fixed top-0 h-16 w-full z-10 shadow-md">
      <div className="flex justify-between items-center h-full px-4">
        <div className="md:hidden flex">
          <Mobile />
          <div className="mt-2 mr-0 text-black mb-2">
            <Button
              variant="outline"
              onClick={boardModal.onOpen}
              className="text-black bg-white "
            >
              Create
            </Button>
          </div>
        </div>
        <div className="hidden  md:block mr-4">
          <div className="flex mt-3 items-center justify-center">
            <Image
              src="/logo.png"
              height={50}
              width={40}
              alt="Illustration of a person organizing tasks"
              className=""
            />
            <span className="text-black text-xl font-bold ml-3 mt-1 ">
              TaskMaster
            </span>
            <div className="ml-4">
              <Button
                variant="outline"
                onClick={boardModal.onOpen}
                className="text-black hover:opacity-85 bg-gray-200 hover:text-black"
              >
                Create
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-4 flex">
          <div className="mr-4">
            {/* <OrganizationSwitcher
              afterCreateOrganizationUrl="/organization/:id"
              afterLeaveOrganizationUrl="/select-org"
              afterSelectOrganizationUrl="/dashboard/:id"
              appearance={{
                baseTheme: shadesOfPurple,
              }}
              hidePersonal={true}
            /> */}
          </div>
          <UserButton
            appearance={{
              baseTheme: shadesOfPurple,
            }}
          />
        </div>
      </div>
      <Separator />
    </div>
  );
}
