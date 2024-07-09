import React from "react";
import { type Editor } from "@tiptap/react";
import { Toggle } from "@/components/ui/toggle";
import { TbBold } from "react-icons/tb";
import { FaItalic } from "react-icons/fa6";
import { BiListUl } from "react-icons/bi";

type Props = {
  editor: Editor | null;
};

const Toolbar: React.FC<Props> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="toolbar mt-2 space-x-2">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        className="text-white"
      >
        <TbBold className="h-5 w-10" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        className="text-white"
      >
        <FaItalic className="h-5 w-10" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        className="text-white "
      >
        <BiListUl className="h-5 w-10" />
      </Toggle>
    </div>
  );
};

export default Toolbar;
