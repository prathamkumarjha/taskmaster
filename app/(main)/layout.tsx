import React from "react";
import Image from "next/image";
import { shadesOfPurple } from "@clerk/themes";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@clerk/nextjs";
import { OrganizationSwitcher } from "@clerk/nextjs";
import Mobile from "./dashboard/_components/mobileSidebar";
export default function Nav({ children }: { children: React.ReactNode }) {
  return (
    <nav>
      <div className="mx-auto bg-custom-blue sticky top-0 z-10">
        <div className="flex justify-between h-16 px-4">
          <div className="md:hidden">
            <Mobile />
          </div>
          <div className="hidden  md:block mr-4">
            <div className="flex mt-3">
              <Image
                src="/logo.png"
                height={50}
                width={40}
                alt="Illustration of a person organizing tasks"
              />
              <span className="text-white text-xl font-bold ml-3 sm:ml-4">
                TaskMaster
              </span>
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
