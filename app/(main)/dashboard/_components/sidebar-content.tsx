"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { FaGear } from "react-icons/fa6";
import { LuLayoutDashboard } from "react-icons/lu";

export default function YourComponent() {
  const router = useRouter();
  const params = useParams();
  const { setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const pathname = usePathname();
  const { organization } = useOrganization();
  const organizationId = organization?.name;

  if (!userMemberships) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-600">Workspaces</h1>

      {userMemberships?.data?.map((membership) => (
        <div key={membership.id} className=" flex flex-row  ">
          <Accordion type="single" collapsible className="pt-4">
            <AccordionItem value={membership.id}>
              <AccordionTrigger>
                <div className="flex items-center justify-center text-black space-x-2">
                  <div className="  rounded-full overflow-hidden  ">
                    <Image
                      alt="organization logo"
                      src={membership.organization.imageUrl}
                      width={50}
                      height={40}
                    />
                  </div>
                  <span
                    className={cn(
                      "transition-all duration-300 hover:text-blue-600 mx-2" &&
                        params.organizationId === membership.organization.id &&
                        "text-blue-600"
                    )}
                  >
                    {membership.organization.name}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-10 text-black ">
                  <div>
                    <button
                      className={cn(
                        " flex p-2 transition-all duration-300 hover:text-black hover:bg-blue-600 rounded-lg m-1 w-full",
                        pathname === `/dashboard/${membership.organization.id}`
                          ? "bg-blue-200 rounded-l-lg text-blue-600"
                          : ""
                      )}
                      onClick={() => {
                        // setActive;
                        setActive &&
                          setActive({
                            organization: membership.organization.id,
                          });
                        router.push(`/dashboard/${membership.organization.id}`);
                      }}
                    >
                      {/* <Image
                        alt="kanban svg"
                        src="/kanban.svg"
                        width={20}
                        height={20}
                        className="pr-1"
                      /> */}
                      <LuLayoutDashboard className="h-5 w-5 pr-1" />
                      Boards
                    </button>
                  </div>
                  <div
                    className="p-2 m-1 cursor-pointer transition-all duration-300 hover:text-black  hover:bg-blue-600 rounded-l-lg"
                    onClick={() => {
                      setActive &&
                        setActive({
                          organization: membership.organization.id,
                        });
                      router.push(
                        `/dashboard/${membership.organization.id}/notification`
                      );
                    }}
                  >
                    <button className="flex">
                      <Image
                        alt="notification svg"
                        src="/notification.svg"
                        width={20}
                        height={20}
                        className="pr-1"
                      />
                      Notifications
                    </button>
                  </div>
                  <div
                    className={cn(
                      "p-2 m-1 transition-all duration-300 hover:text-black hover:bg-blue-600 rounded-l-lg pl-2",
                      pathname ===
                        `/dashboard/${membership.organization.id}/settings`
                        ? "bg-blue-600 rounded-l-lg text-black"
                        : ""
                    )}
                    onClick={() => {
                      setActive &&
                        setActive({
                          organization: membership.organization.id,
                        });
                      router.push(
                        `/dashboard/${membership.organization.id}/settings`
                      );
                    }}
                  >
                    <button className="flex text-black">
                      <FaGear className="h-5 w-5 pr-1 text-black" />
                      Settings
                    </button>
                  </div>

                  <div
                    className="p-2 m-1 cursor-pointer transition-all duration-300 hover:text-black  hover:bg-blue-600 rounded-l-lg"
                    onClick={() => {
                      console.log("Plans clicked");
                    }}
                  >
                    <button className="flex">
                      <Image
                        alt="rupee svg"
                        src="/rupee.svg"
                        width={20}
                        height={20}
                        className="pr-1"
                      />
                      Plans
                    </button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  );
}
