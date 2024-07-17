import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { BiAlignLeft } from "react-icons/bi";
import TextEditor from "./textEditor";
import DOMPurify from "dompurify";

interface cardDescriptionInterface {
  description: string | null;
  cardId: string;
}
const CardDescription: React.FC<cardDescriptionInterface> = ({
  description,
  cardId,
}) => {
  // console.log(description);

  // State for description section
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  // Handle click outside for closing description and comment sections
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        descriptionRef.current &&
        !descriptionRef.current.contains(event.target as Node)
      ) {
        setDescriptionOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const cardDescription = description || "Add a meaningful description";
  const sanitizedDescription = DOMPurify.sanitize(cardDescription);

  return (
    <div className="text-white  space-y-4 pt-8">
      <div className="flex items-center ">
        <BiAlignLeft className="mr-2" /> Description
      </div>
      {/* <TextEditor data={description} type="description" /> */}

      {/* Description section */}
      <div
        ref={descriptionRef}
        onClick={() => setDescriptionOpen(true)}
        className="cursor-pointer"
      >
        {descriptionOpen ? (
          <TextEditor data={description} type="description" cardId={cardId} />
        ) : (
          <div className="h-40 w-80 bg-gray-800 p-2 rounded-lg">
            <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
          </div>
        )}
      </div>
    </div>
  );
};
export default CardDescription;
