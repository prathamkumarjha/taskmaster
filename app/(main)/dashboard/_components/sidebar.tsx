"use client";
import React from "react";
import YourComponent from "./sidebar-content";

const Sidebar = () => {
  return (
    <div className="  border-inherit hidden justify-center lg:block  ">
      {/* <div className="py-4  flex justify-center"> */}
      <YourComponent />
      {/* </div> */}
    </div>
  );
};

export default Sidebar;
