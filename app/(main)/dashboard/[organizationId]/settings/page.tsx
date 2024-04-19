"use client";
import { OrganizationProfile } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
const SettingsPage = () => {
  return (
    <div className="pl-6 flex items-center justify-center h-screen">
      <OrganizationProfile
        appearance={{
          baseTheme: shadesOfPurple,
          elements: {
            rootBox: {
              boxShadow: "none",
            },
            card: {
              border: "1px solid #e5e5e5",
              boxShadow: "none",
              width: "100%",
            },
          },
        }}
      />
    </div>
  );
};

export default SettingsPage;
