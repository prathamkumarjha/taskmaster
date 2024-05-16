"use client";
import { useEffect, useState } from "react";
import CardModal from "./cardModal";

const CardModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  });
  if (!isMounted) {
    return;
  }

  return <CardModal />;
};

export default CardModalProvider;
