"use client";

import { useState, useEffect, useRef } from "react";
import { BiAlignMiddle } from "react-icons/bi";
import TextEditor from "../textEditor";

export type comment = {
  cardId: string;
  content: string;
  createdAt: string;
  id: string;
  parentId: string;
  updatedAt: string;
  userID: string;
  userName: string;
  userImage: string;
};
interface cardCommentInterface {
  content: comment[] | null;
  cardId: string;
  commentId: string | null;
}

const CommentInput: React.FC<cardCommentInterface> = ({
  content,
  cardId,
  commentId,
}) => {
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
    <div className="space-y-4">
      <div
        ref={commentRef}
        onClick={() => setCommentOpen(true)}
        className="cursor-pointer mt-4"
      >
        <div ref={commentRef}>
          {commentOpen ? (
            <TextEditor data="" type="comment" cardId={cardId} />
          ) : (
            <div className="h-10 w-80 bg-gray-600 p-2 rounded-lg">
              Add a comment
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CommentInput;
