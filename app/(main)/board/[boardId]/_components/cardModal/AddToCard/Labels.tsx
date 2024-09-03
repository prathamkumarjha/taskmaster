import { Button } from "@/components/ui/button";
import { MdLabel } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FaPencilAlt } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useStore } from "@/hooks/use-refetch-data";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaCheck } from "react-icons/fa";

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

export const Labels = ({ cardId }: { cardId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [inputData, setInputData] = useState("");
  const { refresh, setRefresh } = useStore();
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

  const [selectedColorNames] = useState(getRandomColors);

  const formSchema = z.object({
    labelname: z.string().min(2, {
      message: "labelname must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      labelname: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const labelName = values.labelname;
    try {
      const del = await axios.post(`/api/card/${cardId}/label`, {
        labelName,
        selectedColor,
      });
      console.log(del);
    } catch (error) {
      console.log(error);
    } finally {
      setRefresh(true);
    }
  }

  async function onSubmitWithoutName(color: string) {
    try {
      setSelectedColor(color);

      console.log("the color which is going to be added is", selectedColor);
      const del = await axios.post(`/api/card/${cardId}/label`, {
        selectedColor: color,
      });

      console.log(del);
    } catch (error) {
      console.log(error);
    } finally {
      setRefresh(true);
    }
  }

  async function onSubmitNewLabelForm() {
    try {
      let response;
      console.log("selected color is", selectedColor);
      if (inputData !== "") {
        // Check if inputData is not empty

        const labelName = inputData;
        response = await axios.post(`/api/card/${cardId}/label`, {
          selectedColor,
          labelName,
        });
      } else {
        // If inputData is empty, only send selectedColor
        response = await axios.post(`/api/card/${cardId}/label`, {
          selectedColor,
        });
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setRefresh(true);
    }
  }

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
        <div key={index}>
          <div className="flex space-x-2 items-center">
            <div
              className="w-full h-8 rounded-lg shadow-md font-semibold flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: darkColors[colorName] }}
              onClick={() => {
                onSubmitWithoutName(colorName);
                setIsOpenForm(false);
              }}
            ></div>
            <FaPencilAlt
              className="cursor-pointer"
              onClick={() => {
                setSelectedColor(colorName);
                setIsOpenForm(true);
              }}
            />
          </div>
          {selectedColor === colorName && isOpenForm && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="labelname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          className="bg-gray-600 placeholder:text-gray-200"
                        />
                      </FormControl>
                      <FormDescription>This is your Labelname.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-x-2">
                  <Button
                    type="submit"
                    //  onClick={() => onSubmit}
                  >
                    Submit
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      setSelectedColor("");
                      setIsOpenForm(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      ))}

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="link" className="text-white">
            create a new label
          </Button>
        </PopoverTrigger>

        <PopoverContent className="bg-gray-900 space-y-2">
          <div className="text-white text-md">Title</div>
          <Input
            className="bg-gray-600 text-white"
            onChange={(e) => {
              setInputData(e.target.value);
            }}
          />
          <div className="text-white text-md">
            Select a color
            <div className="flex flex-wrap">
              {Object.entries(darkColors).map(([colorName, colorValue]) => (
                <div key={colorName}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className="relative w-8 h-8 rounded-full m-2 flex items-center justify-center text-white text-xs cursor-pointer hover:opacity-75"
                          style={{ backgroundColor: colorValue }}
                          onClick={() => setSelectedColor(colorName)}
                        >
                          {selectedColor === colorName && (
                            <FaCheck className="absolute text-white" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-600 text-white">
                        {colorName}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>
          <Button
            disabled={selectedColor == ""}
            onClick={() => {
              onSubmitNewLabelForm();
              console.log(inputData);
            }}
            className="bg-gray-600 hover:opacity-75 hover:bg-gray-600"
          >
            submit
          </Button>
        </PopoverContent>
      </Popover>
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
