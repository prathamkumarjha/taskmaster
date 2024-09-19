"use client";
import { useEffect, useState } from "react";
import { BoardModal } from "./boards-modal";
import Nav from "./navbar";

const NavProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return;
  } else {
    return <Nav />;
  }
};

export default NavProvider;
