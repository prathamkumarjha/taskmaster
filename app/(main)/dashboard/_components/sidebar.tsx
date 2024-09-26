"use client";
import React from "react";
import YourComponent from "./sidebar-content";

const Sidebar = () => {
  return (
    <div className="  border-inherit hidden justify-center lg:block overflow-scroll  pt-20 px-2">
      {/* <div className="py-4  flex justify-center"> */}
      <YourComponent />
      {/* </div> */}
    </div>
  );
};

export default Sidebar;
