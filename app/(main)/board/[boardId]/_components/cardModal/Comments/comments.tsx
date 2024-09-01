import { useMemo } from "react";
import DOMPurify from "dompurify";
import { comment } from "./commentInput";
import Image from "next/image";
import CommentReply from "./commentReply";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import axios from "axios";
import router, { useRouter } from "next/navigation";
import { useStore } from "@/hooks/use-refetch-data";
interface CommentsInterface {
  content: comment[];
  parentId?: string;
  // cardId: string;
}

export const Comments: React.FC<CommentsInterface> = ({
  content,
  parentId = "",
}) => {
  const commentsByParentId = useMemo(() => {
    const group: { [key: string]: comment[] } = {};
    content.forEach((comment) => {
      const pid = comment.parentId || ""; // Default to empty string if parentId is null or undefined
      group[pid] ||= [];
      group[pid].push(comment);
    });
    return group;
  }, [content]);

  const router = useRouter();
  const { refresh, setRefresh } = useStore();

  const nestedComments = (parentId: string): JSX.Element[] | null => {
    if (!commentsByParentId[parentId]) return null;

    //function for deletion of code
    const onDelete = async (cardId: string, commentId: string) => {
      console.log("this is commentId", commentId);
      await axios
        .delete(`/api/card/${cardId}/comment`, {
          data: {
            commentId: commentId,
            cardId: cardId,
          },
        })
        .then(() => {
          console.log("deletion successful");
          setRefresh(true);
        })

        .catch((error) => console.error("Error deleting comment:", error));
    };

    return commentsByParentId[parentId].map((comment) => (
      <div key={comment.id} className="relative ml-4 pl-4 w-96 pr-10">
        <div className="before:absolute before:left-0 before:top-0 before:bottom-0 before:border-l-2 before:border-gray-400">
          <div className="comment mb-4 p-4  rounded-md shadow-lg">
            <div className="flex items-center mb-2">
              <Image
                src={comment.userImage}
                alt={comment.userName}
                height={30}
                width={30}
                className="w-8 h-8 rounded-full mr-2"
              />
              <div className="comment-author font-semibold text-white">
                {comment.userName}
                <span className="comment-timestamp text-xs text-gray-400 mt-1 pl-2">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="comment-content text-gray-300 bg-gray-600 p-4 rounded-lg">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(comment.content),
                }}
              />
            </div>
            <div className="flex">
              <CommentReply commentId={comment.id} cardId={comment.cardId} />
              <span
                className="hover:text-blue-500 pt-2 hover:underline cursor-pointer"
                onClick={() => {
                  onDelete(comment.cardId, comment.id);
                }}
              >
                delete
              </span>
              <span className="hover:underline m-2 pt-1 hover:cursor-pointer">
                <MdOutlineEmojiEmotions className="hover:text-blue-500" />
              </span>
            </div>
          </div>

          {nestedComments(comment.id)}
        </div>
      </div>
    ));
  };

  return <>{nestedComments(parentId)}</>;
};
