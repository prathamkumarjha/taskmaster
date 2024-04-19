"use client";
import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/clerk-react";
import { useEffect } from "react";
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
      {/* <Sidebar /> */}
      {/* we will work on it */}
    </div>
  );
}
