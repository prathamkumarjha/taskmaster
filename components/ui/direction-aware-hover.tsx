// components/ui/direction-aware-hover.tsx

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const DirectionAwareHover = ({
  imageUrl,
  children,
  className,
}: {
  imageUrl: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<
    "top" | "bottom" | "left" | "right" | string
  >("left");

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!ref.current) return;

    const direction = getDirection(event, ref.current);
    switch (direction) {
      case 0:
        setDirection("top");
        break;
      case 1:
        setDirection("right");
        break;
      case 2:
        setDirection("bottom");
        break;
      case 3:
        setDirection("left");
        break;
      default:
        setDirection("left");
        break;
    }
  };

  const getDirection = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
    obj: HTMLElement
  ) => {
    const { width: w, height: h, left, top } = obj.getBoundingClientRect();
    const x = ev.clientX - left - (w / 2) * (w > h ? h / w : 1);
    const y = ev.clientY - top - (h / 2) * (h > w ? w / h : 1);
    const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
    return d;
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      ref={ref}
      className={`relative md:h-96 w-60 h-60 md:w-96 bg-transparent rounded-lg overflow-hidden ${className}`}
    >
      <AnimatePresence>
        <motion.div
          className="relative h-full w-full"
          initial="initial"
          whileHover={direction}
          exit="exit"
        >
          {/* Overlay for hover effect */}
          <motion.div className="absolute inset-0 w-full h-full bg-black/40 z-10 transition duration-500" />
          {/* Image */}
          <motion.img
            alt="image"
            className="h-full w-full object-cover scale-[1.15]"
            src={imageUrl}
          />
          {/* Children elements (e.g., name and buttons) */}
          {children}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
