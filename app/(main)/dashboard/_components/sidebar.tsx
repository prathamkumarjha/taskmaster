"use client";
import React from "react";
import YourComponent from "./sidebar-content";

const Sidebar = () => {
  return (
    <div className="w-56 bg-gray-800 h-screen border-inherit hidden justify-center ml-6 mt-8 sm:flex">
      <div className="py-4 px-8 text-white">
        <YourComponent />
      </div>
    </div>
  );
};

export default Sidebar;
