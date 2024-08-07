import { comment } from "./commentInput";
import { Comments } from "./comments";

interface CommentsListInterface {
  content: comment[];
}

export const CommentsList: React.FC<CommentsListInterface> = ({ content }) => {
  console.log(content);
  return (
    <div>
      <Comments content={content} parentId="" />
    </div>
  );
};
