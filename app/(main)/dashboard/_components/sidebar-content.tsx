import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { useOrganizationList } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
export default function YourComponent() {
  const router = useRouter();
  const { setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (!userMemberships) {
    return null;
  }

  {
    userMemberships.data?.map((membership) =>
      console.log(membership.organization.id)
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-semibold">Workspaces</h1>
      {userMemberships?.data?.map((membership) => (
        <div key={membership.id} className=" flex flex-row  justify-center">
          <Accordion type="single" collapsible className="pt-4">
            <AccordionItem value={membership.id}>
              <AccordionTrigger>
                <div className="flex items-center ">
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
                <div className="pl-10 ">
                  <div
                    onClick={() => {
                      setActive &&
                        setActive({ organization: membership.organization.id });
                      router.push(`boards`);
                    }}
                  >
                    <button>Boards</button>
                  </div>
                  <div
                    className="cursor-pointer "
                    onClick={() => {
                      console.log("Notifications clicked");
                    }}
                  >
                    <button> Notifications</button>
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setActive &&
                        setActive({ organization: membership.organization.id });
                      router.push(`settings`);
                    }}
                  >
                    <button>Settings</button>
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      console.log("Plans clicked");
                    }}
                  >
                    <button>Plans</button>
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
