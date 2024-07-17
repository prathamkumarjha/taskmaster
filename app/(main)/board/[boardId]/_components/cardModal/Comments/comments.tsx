import { useMemo } from "react";
import DOMPurify from "dompurify";
import { comment } from "./commentInput";
import Image from "next/image";

interface CommentsInterface {
  content: comment[];
  parentId?: string;
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

  const nestedComments = (parentId: string): JSX.Element[] | null => {
    if (!commentsByParentId[parentId]) return null;

    return commentsByParentId[parentId].map((comment) => (
      <div key={comment.id} className="relative ml-4 pl-4">
        <div className="before:absolute before:left-0 before:top-0 before:bottom-0 before:border-l-2 before:border-gray-400">
          <div className="comment mb-4 p-4 bg-gray-800 rounded-md shadow-sm">
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
            <div className="comment-content text-gray-300">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(comment.content),
                }}
              />
            </div>
          </div>
          {nestedComments(comment.id)}
        </div>
      </div>
    ));
  };

  return <>{nestedComments(parentId)}</>;
};
