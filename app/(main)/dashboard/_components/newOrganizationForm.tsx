"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { FormEventHandler, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NewOrganizationForm() {
  const { createOrganization } = useOrganizationList();
  const [organizationName, setOrganizationName] = useState("");
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!createOrganization) {
      console.error("createOrganization function is unavailable");
      return;
    }

    try {
      await createOrganization({ name: organizationName });
      setOrganizationName("");
      router.refresh();
    } catch (error) {
      console.error("Error creating organization:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        name="organizationName"
        value={organizationName}
        onChange={(e) => setOrganizationName(e.currentTarget.value)}
        placeholder="Organization Name"
        required
      />
      <Button type="submit" className="mt-4">
        Create organization
      </Button>
    </form>
  );
}
