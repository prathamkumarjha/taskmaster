import useSWR from "swr";
import Image from "next/image";

type OnImageSelectFn = (imageUrl: string) => void;

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

const BackgroundImages = ({
  onImageSelect,
}: {
  onImageSelect: OnImageSelectFn;
}) => {
  const { data, error } = useSWR<any[]>(
    "https://api.unsplash.com/photos/random?count=9&orientation=landscape&client_id=OEc6i_e-g0rh4pG8YJSTS_MOf4HqEK7wnvkj_1DQN9Y",
    fetcher,
    { revalidateOnFocus: false }
  );

  const handleImageSelect = (imageUrl: string) => {
    onImageSelect(imageUrl);
  };

  if (error) return <div className="text-red-500">Error: {error.message}</div>;
  if (!data) return <div className="text-blue-500">Loading...</div>;

  return (
    <div className="mb-2 grid grid-cols-3 gap-2">
      {data.map((val) => (
        <div
          key={val.id}
          className="overflow-hidden"
          onClick={() => handleImageSelect(val.urls.regular)}
        >
          <Image
            src={val.urls.regular}
            alt="image"
            width={180}
            height={90}
            className="group relative aspect-video cursor-pointer bg-muted transition hover:opacity-75"
          />
        </div>
      ))}
    </div>
  );
};

export default BackgroundImages;
