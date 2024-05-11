// "use client";
import useSWR from "swr";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { useBackgroundImageStore } from "@/hooks/use-BackgroundImage-store";
type OnImageSelectFn = (imageUrl: string) => void;

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

interface BackgroundImagesProps {
  onImageSelect: OnImageSelectFn;
}

export const BackgroundImages: React.FC<BackgroundImagesProps> = ({
  onImageSelect,
}: {
  onImageSelect: OnImageSelectFn;
}) => {
  const [selected, setSelected] = useState("");
  const { selectedBackground, setSelectedBackground } =
    useBackgroundImageStore();

  const { data, error } = useSWR<any[]>("/api/unsplash", fetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (data && data.length > 0) {
      setSelected(data[0].urls.regular);
      setSelectedBackground(data[0].urls.regular);
    }
  }, [data, setSelectedBackground]);

  const handleImageSelect = (imageUrl: string) => {
    if (imageUrl === "") {
      onImageSelect(selected);
      setSelectedBackground(imageUrl);
    } else {
      onImageSelect(imageUrl);
      setSelectedBackground(imageUrl);
    }
    setSelected(imageUrl);
  };

  if (error) return <div className="text-red-500">Error: {error.message}</div>;
  if (!data) return <div className="text-blue-500">Loading...</div>;

  return (
    <div className="mb-2 grid grid-cols-3 gap-2">
      {data.map((val) => (
        <div
          key={val.id}
          className="relative overflow-hidden"
          onClick={() => handleImageSelect(val.urls.regular)}
        >
          <Image
            draggable="false"
            src={val.urls.regular}
            alt="image"
            width={180}
            height={90}
            className={cn(
              "group relative cursor-pointer bg-muted transition hover:opacity-50",
              selected === val.urls.regular ? "opacity-50" : ""
            )}
          />
          {selected === val.urls.regular && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <FaCheck className="text-gray-900 text-xl" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
