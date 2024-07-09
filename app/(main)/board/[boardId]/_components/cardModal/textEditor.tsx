import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import BulletList from "@tiptap/extension-bullet-list";
import Toolbar from "./toolbar";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface TextEditorInterface {
  data: string | null;
  type: string;
  cardId: string;
}

const TextEditor: React.FC<TextEditorInterface> = ({ data, type, cardId }) => {
  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, BulletList],
    content: data || "",
    editorProps: {
      attributes: {
        class:
          "p-2 mt-2 border-0 outline-2 text-gray-200 rounded-lg min-h-20 bg-gray-800 list-disc ",
      },
    },
  });
  // console.log(editor?.getHTML());
  const onsubmit = () => {
    console.log(editor?.getHTML(), "for the type of ", type);
    const data = editor?.getHTML();
    axios.post(`/api/card/${cardId}/comment`, { data });
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
