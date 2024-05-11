import Image from "next/image";
import { useBackgroundImageStore } from "@/hooks/use-BackgroundImage-store";

interface BoardPreviewProps {
  selectedBackground: string; // Define the type of selectedBackground
}

export const BoardPreview: React.FC = () => {
  const { selectedBackground } = useBackgroundImageStore();

  return <BoardPreviewContent selectedBackground={selectedBackground} />;
};

const BoardPreviewContent: React.FC<BoardPreviewProps> = ({
  selectedBackground,
}) => {
  return (
    <div className="relative w-180 h-90 shadow-md ">
      {/* Render the selected background image */}
      {selectedBackground && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <Image
            draggable="false"
            src={selectedBackground}
            alt="Selected Background"
            width={100} // Increase the width
            height={30} // Increase the height
            objectFit="cover"
            className="rounded-md shadow-md"
          />
        </div>
      )}
      {/* Render the cards SVG */}
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <Image
          draggable="false"
          src="/cards.svg"
          alt="preview"
          width={80} // Increase the width
          height={25} // Increase the height
          className="transform"
        />
      </div>
    </div>
  );
};
