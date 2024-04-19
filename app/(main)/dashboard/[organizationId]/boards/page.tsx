"use client";
import Sidebar from "../../_components/sidebar";
import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/clerk-react";
import { useEffect } from "react";
export default function Page() {
  const { organization } = useOrganization();
  console.log(organization?.id);
  const organizationId = organization?.id;
  const router = useRouter();

  useEffect(() => {
    if (organizationId) {
      router.push(`/dashboard/${[organizationId]}/boards`);
    }
  }, [organizationId, router]);

  return (
    <div className="bg-gray-800 min-h-screen text-stone-300 flex">
      <Sidebar />
      {/* we will work on it */}
    </div>
  );
}
