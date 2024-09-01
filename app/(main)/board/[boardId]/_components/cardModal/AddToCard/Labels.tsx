import { Button } from "@/components/ui/button";
import { MdLabel } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

// Define the dark colors with proper typing
const darkColors: { [key: string]: string } = {
  darkOliveGreen: "#556B2F",
  forestGreen: "#228B22",
  darkSeaGreen: "#8FBC8F",
  mossGreen: "#8A9A5B",
  hunterGreen: "#355E3B",
  darkPink: "#E75480",
  deepPink: "#FF1493",
  raspberry: "#872657",
  darkHotPink: "#FF007F",
  maroon: "#800000",
  indigo: "#4B0082",
  eggplant: "#614051",
  plum: "#8E4585",
  royalPurple: "#7851A9",
  darkOrchid: "#9932CC",
  midnightBlue: "#191970",
  navyBlue: "#000080",
  darkSlateBlue: "#483D8B",
  prussianBlue: "#003153",
  royalBlue: "#002366",
  darkRed: "#8B0000",
  burgundy: "#800020",
  crimson: "#DC143C",
  firebrick: "#B22222",
  bloodRed: "#660000",
  darkGoldenrod: "#B8860B",
  mustard: "#8B8000",
  olive: "#808000",
  khaki: "#BDB76B",
  bronze: "#665D1E",
  darkCyan: "#008B8B",
  slateGray: "#708090",
  deepSeaBlue: "#002F6C",
  mahogany: "#C04000",
  saddleBrown: "#8B4513",
};

export const Labels = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Arrays of colors for different varieties
  const greenColors = [
    "darkOliveGreen",
    "forestGreen",
    "darkSeaGreen",
    "mossGreen",
    "hunterGreen",
  ];
  const pinkColors = [
    "darkPink",
    "deepPink",
    "raspberry",
    "darkHotPink",
    "maroon",
  ];
  const purpleColors = [
    "indigo",
    "eggplant",
    "plum",
    "royalPurple",
    "darkOrchid",
  ];
  const blueColors = [
    "midnightBlue",
    "navyBlue",
    "darkSlateBlue",
    "prussianBlue",
    "royalBlue",
  ];
  const redColors = ["darkRed", "burgundy", "crimson", "firebrick", "bloodRed"];
  const yellowColors = ["darkGoldenrod", "mustard", "olive", "khaki", "bronze"];

  const getRandomColors = () => {
    const getRandomFromArray = (arr: string[]) =>
      arr[Math.floor(Math.random() * arr.length)];

    return [
      getRandomFromArray(greenColors),
      getRandomFromArray(pinkColors),
      getRandomFromArray(purpleColors),
      getRandomFromArray(blueColors),
      getRandomFromArray(redColors),
      getRandomFromArray(yellowColors),
    ];
  };

  const selectedColorNames = getRandomColors();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const labelsList = (
    <div
      ref={modalRef}
      className="absolute bg-gray-800 shadow-lg rounded-lg z-[101] w-80 text-white p-4 space-y-2"
    >
      <span className="mb-4">Select a label</span>
      {selectedColorNames.map((colorName, index) => (
        <div key={index} className="flex space-x-2 items-center">
          <Checkbox className="border-white" />
          <div
            className="w-full h-8 rounded-lg shadow-md text-white font-semibold flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: darkColors[colorName] }}
          ></div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <Button
        className="bg-gray-600 text-md mt-2 pt-0 pb-0"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        ref={buttonRef}
      >
        <MdLabel className="mr-1" /> Labels
      </Button>
      {isOpen && labelsList}
    </div>
  );
};
