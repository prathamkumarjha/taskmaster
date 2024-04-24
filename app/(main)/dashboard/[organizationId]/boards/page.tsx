"use client";
import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BoardModal } from "@/components/ui/modals/boards-modal";
export default function Page() {
  const { organization } = useOrganization();
  const organizationId = organization?.id;
  const router = useRouter();

  useEffect(() => {
    if (organizationId) {
      router.push(`/dashboard/${[organizationId]}/boards`);
    }
  }, [organizationId, router]);

  return (
    <div>
      we will work here too...
      <BoardModal />
    </div>
  );
}
