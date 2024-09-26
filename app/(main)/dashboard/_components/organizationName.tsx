"use client"; // Ensure this is at the top

import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";

export const OrganizationName = () => {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) return <></>;

  //console.log(organization); // Debugging purposes

  return (
    <div className="flex font-semibold text-5xl text-gray-600 mt-10 border-b-2 border-gray-200 pb-2 items-center">
      <Image
        src={organization?.imageUrl!}
        height={80}
        width={80}
        alt="org img"
        className="rounded-lg mr-2"
      />
      {organization?.name}
    </div>
  );
};
