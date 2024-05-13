import { useEffect } from "react";

interface useDragOverEffectInterface {
  callback: () => void;
}

const useDragOverEffect = ({ callback }: useDragOverEffectInterface) => {
  useEffect(() => {
    // Add the event listener for drag-over event
    const handleDragOver = (event: DragEvent) => {
      // Prevent default behavior to enable drop
      event.preventDefault();
    };

    // Add the event listener to the document
    document.addEventListener("dragover", handleDragOver);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("dragover", handleDragOver);
    };
  }, [callback]); // Include callback in the dependencies array to ensure it's up-to-date
};

export default useDragOverEffect;
