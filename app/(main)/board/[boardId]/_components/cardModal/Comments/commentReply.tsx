import { MdOutlineEmojiEmotions } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import TextEditor from "../textEditor";

interface CommentReplyInterface {
  commentId: string;
  cardId: string;
}

const CommentReply: React.FC<CommentReplyInterface> = ({
  commentId,
  cardId,
}) => {
  const [openReply, setReply] = useState(false);
  const replyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        replyRef.current &&
        !replyRef.current.contains(event.target as Node)
      ) {
        setReply(false);
      }
    }

    if (openReply) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openReply]);

  return (
    <div>
      <div className="flex items-center">
        <button
          className="hover:underline m-2 hover:cursor-pointer hover:text-blue-500"
          onClick={() => setReply(true)}
        >
          reply
        </button>
      </div>
      {openReply ? (
        <div
          ref={replyRef}
          className="border-2 border-gray-900 w-full p-2 rounded-lg"
        >
          <TextEditor
            type="reply"
            cardId={cardId}
            data=""
            commentId={commentId}
          />
        </div>
      ) : null}
    </div>
  );
};

export default CommentReply;
