import { CreateOrganization } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <CreateOrganization />
    </div>
  );
}
