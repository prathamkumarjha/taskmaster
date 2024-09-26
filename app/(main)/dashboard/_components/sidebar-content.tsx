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
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NewOrganizationForm from "./newOrganizationForm";

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
    <div className="mr-6 w-full">
      <div className="text-2xl font-semibold text-gray-600  flex justify-center  items-center ">
        Workspaces
        {/* <Popover>
          <PopoverTrigger className="m-2"> */}
        <Button
          className="ml-2  bg-white  hover:opacity-85 hover:bg-gray-100"
          onClick={() => router.push("/create-organization")}
        >
          <FaPlus className="text-black" />
        </Button>
        {/* </PopoverTrigger>
          <PopoverContent>
            <NewOrganizationForm />
          </PopoverContent> 
         </Popover> */}
      </div>

      {userMemberships?.data?.map((membership) => (
        <div
          key={membership.id}
          className=" flex flex-row w-full justify-center "
        >
          <Accordion
            type="single"
            collapsible
            className="mr-4 w-full  text-black"
          >
            <AccordionItem value={membership.id} className="w-full">
              <AccordionTrigger className="w-full">
                <div className="flex items-center justify-center w-full text-black space-x-2">
                  <div className="flex justify-between w-full items-center p-6">
                    <div className="flex items-center">
                      {/* <div className="  rounded-full overflow-hidden flex justify-between mr-2"> */}
                      <Image
                        alt="organization logo"
                        src={membership.organization.imageUrl}
                        width={40}
                        height={40}
                        className="rounded-full mr-2"
                      />
                      {/* </div> */}
                      <div
                        className={cn(
                          "transition-all duration-300 hover:text-blue-600 py-0" &&
                            params.organizationId ===
                              membership.organization.id &&
                            "text-blue-600"
                        )}
                      >
                        {membership.organization.name}
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-10 text-black ">
                  <div>
                    <button
                      className={cn(
                        " flex p-2 transition-all duration-300 hover:text-black hover:bg-blue-600 rounded-lg  w-full",
                        pathname === `/dashboard/${membership.organization.id}`
                          ? "bg-blue-200 rounded-lg text-blue-600"
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
                    className={cn(
                      " flex p-2 transition-all duration-300 hover:text-black hover:bg-blue-600 rounded-lg  w-full",
                      pathname ===
                        `/dashboard/${membership.organization.id}/notification`
                        ? "bg-blue-200 rounded-lg text-blue-600"
                        : ""
                    )}
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
                    className="w-full"
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
                    <button
                      className={cn(
                        " flex p-2 transition-all duration-300 hover:text-black hover:bg-blue-600 rounded-lg w-full ",
                        pathname ===
                          `/dashboard/${membership.organization.id}/settings`
                          ? "bg-blue-200 rounded-lg text-blue-600"
                          : ""
                      )}
                    >
                      <FaGear className="h-5 w-5 pr-1 text-black" />
                      Settings
                    </button>
                  </div>

                  <div
                    className={cn(
                      " flex p-2 transition-all duration-300 hover:text-black hover:bg-blue-600 rounded-lg ",
                      pathname ===
                        `/dashboard/${membership.organization.id}/plans`
                        ? "bg-blue-200 rounded-lg text-blue-600"
                        : ""
                    )}
                    onClick={() => {
                      console.log("Plans clicked");
                    }}
                  >
                    <button
                      className="flex"
                      onClick={() => {
                        setActive &&
                          setActive({
                            organization: membership.organization.id,
                          });
                        router.push(
                          `/dashboard/${membership.organization.id}/plans`
                        );
                      }}
                    >
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
