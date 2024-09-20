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
    <div className="  text-black bg-custom-blue fixed top-0 h-16 w-full z-10">
      <div className="flex justify-between h-full px-4">
        <div className="md:hidden flex">
          <Mobile />
          <div className="mt-4 mr-0 text-black">
            <Button
              variant="outline"
              onClick={boardModal.onOpen}
              className="text-black"
            >
              Create
            </Button>
          </div>
        </div>
        <div className="hidden  md:block mr-4">
          <div className="flex mt-3">
            <Image
              src="/logo.png"
              height={50}
              width={40}
              alt="Illustration of a person organizing tasks"
            />
            <span className="text-white text-xl font-bold ml-3 mt-1 ">
              TaskMaster
            </span>
            <div className="ml-4">
              <Button variant="outline" onClick={boardModal.onOpen}>
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
