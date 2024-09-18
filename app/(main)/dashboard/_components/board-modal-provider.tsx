"use client";
import { useEffect, useState } from "react";
import { BoardModal } from "./boards-modal";

const BoardModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return;
  } else {
    return <BoardModal />;
  }
};

export default BoardModalProvider;
