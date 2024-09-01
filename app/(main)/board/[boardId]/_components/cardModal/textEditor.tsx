import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import BulletList from "@tiptap/extension-bullet-list";
import Toolbar from "./toolbar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
interface TextEditorInterface {
  data: string | null;
  type: string;
  cardId: string;
  commentId?: string;
}
import { useStore } from "@/hooks/use-refetch-data";
import { useToast } from "@/components/ui/use-toast";

const TextEditor: React.FC<TextEditorInterface> = ({
  data,
  type,
  cardId,
  commentId,
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, BulletList],
    content: data || "",
    editorProps: {
      attributes: {
        class:
          "p-2 mt-2 border-0 outline-2 text-gray-200 rounded-lg min-h-20 bg-gray-600 list-disc ",
      },
    },
  });

  const router = useRouter();
  const { setRefresh } = useStore();
  const { toast } = useToast();

  const onsubmit = () => {
    const content = editor?.getHTML();
    if (!content) return;

    const postData = (url: string) => {
      axios
        .post(url, { data: content, parentId: commentId })
        .then(() => {
          if (type == "description") {
            toast({
              title: `${type} updated`,
            });
          } else {
            toast({
              title: `${type} added`,
            });
          }
          router.refresh();
          setRefresh(true);
          console.log("refreshed", data);
        })
        .catch((error) => console.error("Error:", error));
    };

    if (type === "description") {
      postData(`/api/card/${cardId}/description`);
    } else if (type === "comment") {
      postData(`/api/card/${cardId}/comment`);
    }
    if (type === "reply") {
      postData(`/api/card/${cardId}/comment`);
    }
  };

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <div className="mt-4">
        <Button onClick={onsubmit}>submit</Button>
      </div>
    </div>
  );
};

export default TextEditor;
