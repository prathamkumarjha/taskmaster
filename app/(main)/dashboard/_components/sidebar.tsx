"use client";
import React from "react";
import YourComponent from "./sidebar-content";

const Sidebar = () => {
  return (
    <div className="w-56  border-inherit hidden justify-center lg:block overflow-scroll">
      <div className="py-4  flex justify-center">
        <YourComponent />
      </div>
    </div>
  );
};

export default Sidebar;
