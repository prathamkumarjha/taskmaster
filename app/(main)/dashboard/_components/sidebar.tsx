"use client";
import React from "react";
import YourComponent from "./sidebar-content";

const Sidebar = () => {
  return (
    <div className="w-56 bg-custom-blue h-screen border-inherit hidden  justify-center sm:flex">
      <div className="py-4  text-white">
        <YourComponent />
      </div>
    </div>
  );
};

export default Sidebar;
