"use client";
import React from "react";
import YourComponent from "./sidebar-content";

const Sidebar = () => {
  return (
    <div className="w-56 bg-gray-900 border-inherit hidden ml-8 justify-center lg:block overflow-scroll">
      <div className="py-4  text-white">
        <YourComponent />
      </div>
    </div>
  );
};

export default Sidebar;
