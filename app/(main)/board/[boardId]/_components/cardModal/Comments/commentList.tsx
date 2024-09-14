import { comment } from "./commentInput";
import { Comments } from "./comments";

interface CommentsListInterface {
  content: comment[];
}

export const CommentsList: React.FC<CommentsListInterface> = ({ content }) => {
  return <Comments content={content} parentId="" />;
};
