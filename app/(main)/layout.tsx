"use client";
import React from "react";
import Image from "next/image";
import { shadesOfPurple } from "@clerk/themes";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@clerk/nextjs";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { useBoardModal } from "@/hooks/use-board-modal";
import Mobile from "./dashboard/_components/mobileSidebar";
import { Button } from "@/components/ui/button";

export default function Nav({ children }: { children: React.ReactNode }) {
  const boardModal = useBoardModal();
  return (
    <nav>
      <div className="mx-auto bg-custom-blue sticky top-0 z-10">
        <div className="flex justify-between h-16 px-4">
          <div className="md:hidden flex">
            <Mobile />
            <div className="mt-4 mr-0 ">
              <Button variant="outline" onClick={boardModal.onOpen}>
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
              <OrganizationSwitcher
                appearance={{
                  baseTheme: shadesOfPurple,
                }}
                hidePersonal={true}
              />
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
      {children}
    </nav>
  );
}
