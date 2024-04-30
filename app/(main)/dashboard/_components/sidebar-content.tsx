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
import { useOrganizationList } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
export default function YourComponent() {
  const router = useRouter();
  const params = useParams();
  const { setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const pathname = usePathname();
  if (!userMemberships) {
    return null;
  }
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Workspaces</h1>
      {userMemberships?.data?.map((membership) => (
        <div key={membership.id} className=" flex flex-row  ">
          <Accordion type="single" collapsible className="pt-4">
            <AccordionItem value={membership.id}>
              <AccordionTrigger>
                <div className="flex items-center text-white">
                  <div className="  rounded-full overflow-hidden mr-4 ">
                    <Image
                      alt="organization logo"
                      src={membership.organization.imageUrl}
                      width={50}
                      height={40}
                    />
                  </div>
                  <span
                    className={cn(
                      "transition-all duration-300 hover:text-blue-600" &&
                        params.organizationId === membership.organization.id &&
                        "text-blue-600"
                    )}
                  >
                    {membership.organization.name}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-10 text-white ">
                  <div
                    className={cn(
                      "p-2 transition-all duration-300 hover:text-white hover:bg-blue-600 rounded-l-lg pl-2 m-1",
                      pathname ===
                        `/dashboard/${membership.organization.id}/boards`
                        ? "bg-blue-600 rounded-l-lg text-white"
                        : ""
                    )}
                    onClick={() => {
                      setActive &&
                        setActive({ organization: membership.organization.id });
                      router.push(`boards`);
                    }}
                  >
                    <button className="flex">
                      <Image
                        alt="kanban svg"
                        src="/kanban.svg"
                        width={20}
                        height={20}
                        className="pr-1"
                      />
                      Boards
                    </button>
                  </div>
                  <div
                    className="p-2 m-1 cursor-pointer transition-all duration-300 hover:text-white  hover:bg-blue-600 rounded-l-lg"
                    onClick={() => {
                      console.log("Notifications clicked");
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
                      "p-2 m-1 transition-all duration-300 hover:text-white hover:bg-blue-600 rounded-l-lg pl-2",
                      pathname ===
                        `/dashboard/${membership.organization.id}/settings`
                        ? "bg-blue-600 rounded-l-lg text-white"
                        : ""
                    )}
                    onClick={() => {
                      setActive &&
                        setActive({ organization: membership.organization.id });
                      router.push(
                        `/dashboard/${membership.organization.id}/settings`
                      );
                    }}
                  >
                    <button className="flex">
                      <Image
                        alt="setting svg"
                        src="/setting.svg"
                        width={20}
                        height={20}
                        className="pr-1"
                      />
                      Settings
                    </button>
                  </div>

                  <div
                    className="p-2 m-1 cursor-pointer transition-all duration-300 hover:text-white  hover:bg-blue-600 rounded-l-lg"
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
