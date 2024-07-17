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
  content: comment[];
  cardId: string;
}

const CommentInput: React.FC<cardCommentInterface> = ({ content, cardId }) => {
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

  //convert data to nested format
  // console.log(content);
  // const commentsByParentId = useMemo(() => {
  //   const group: { [key: string]: comment[] } = {};
  //   content.forEach((comment) => {
  //     group[comment.parentId] ||= [];
  //     group[comment.parentId].push(comment);
  //   });
  //   return group;
  // }, [content]);

  // console.log(commentsByParentId);
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
export default CommentInput;
