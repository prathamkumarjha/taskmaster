import { OrganizationList } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <OrganizationList
        hidePersonal={true}
        afterSelectOrganizationUrl="/dashboard/:id"
        afterCreateOrganizationUrl="/dashboard/:id"
      />
    </div>
  );
}
