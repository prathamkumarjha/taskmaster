import { useState, useEffect } from "react";
import useSWR from "swr";
import Image from "next/image";
import { useBackgroundImageStore } from "@/hooks/use-BackgroundImage-store";
import { FaCheck } from "react-icons/fa6";
import { cn } from "@/lib/utils"; // Assuming you're using a utility function to combine class names

type UnsplashImage = {
  id: string;
  urls: {
    regular: string;
  };
};

type BackgroundImagesProps = {
  onImageSelect: (imageUrl: string) => void;
};

const fetcher = (url: string): Promise<UnsplashImage[]> =>
  fetch(url).then((res) => res.json());

export const BackgroundImages: React.FC<BackgroundImagesProps> = ({
  onImageSelect,
}) => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const { selectedBackground, setSelectedBackground } =
    useBackgroundImageStore();
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    // Ensure this component is only active on the client
    setIsClient(true);
  }, []);

  const { data, error } = useSWR<UnsplashImage[]>(
    isClient ? "/api/unsplash" : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (data && data.length > 0) {
      const defaultImage = data[0].urls.regular;
      setSelected(defaultImage);
      setSelectedBackground(defaultImage);
    }
  }, [data, setSelectedBackground]);

  if (!isClient) return null; // Prevent rendering until client-side

  if (error) return <div className="text-red-500">Error loading images</div>;
  if (!data) return <div className="text-blue-500">Loading images...</div>;

  const handleImageSelect = (imageUrl: string) => {
    onImageSelect(imageUrl);
    setSelectedBackground(imageUrl);
    setSelected(imageUrl);
  };

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
            alt={`Unsplash image ${val.id}`}
            width={180}
            height={90}
            className={cn(
              "group relative cursor-pointer bg-muted transition hover:opacity-50 h-full",
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
