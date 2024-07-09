"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { BiAlignMiddle } from "react-icons/bi";
import TextEditor from "../textEditor";

interface cardCommentInterface {
  content: string | null;
  cardId: string;
}

const Comments: React.FC<cardCommentInterface> = ({ content, cardId }) => {
  // State for comment section
  const [commentOpen, setCommentOpen] = useState(false);
  const commentRef = useRef<HTMLDivElement>(null);

  // Handle click outside for closing description and comment sections
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        commentRef.current &&
        !commentRef.current.contains(event.target as Node)
      ) {
        setCommentOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-4 pt-4">
      <div
        ref={commentRef}
        onClick={() => setCommentOpen(true)}
        className="cursor-pointer mt-4"
      >
        <div className="flex space-x-2 items-center">
          <BiAlignMiddle /> <h1>Comments</h1>
        </div>
        {commentOpen ? (
          <TextEditor data="" type="comment" cardId={cardId} />
        ) : (
          <div className="h-10 w-80 bg-gray-800 p-2 rounded-lg">
            Add a comment
          </div>
        )}
      </div>
    </div>
  );
};
export default Comments;
