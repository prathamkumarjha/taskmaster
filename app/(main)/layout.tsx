import React from "react";
import Image from "next/image";
import { dark } from "@clerk/themes";
import { Separator } from "@/components/ui/separator";
import { UserButton } from "@clerk/nextjs";
import { OrganizationSwitcher } from "@clerk/nextjs";
export default function Nav({ children }: { children: React.ReactNode }) {
  return (
    <nav className="">
      <div className="mx-auto  bg-gray-800 sticky top-0 z-10">
        <div className="flex justify-between h-16 px-4">
          <div className="flex-shrink-0 flex items-center">
            <Image
              src="/logo.png"
              height={50}
              width={40}
              alt="Illustration of a person organizing tasks"
            />
            <span className="text-white text-xl font-bold ml-3">
              TaskMaster
            </span>
          </div>

          <div className="pt-4 flex">
            <div className="mr-4 ">
              <OrganizationSwitcher
                appearance={{
                  baseTheme: dark,
                }}
                hidePersonal={true}
              />
            </div>
            <UserButton
              appearance={{
                baseTheme: dark,
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
