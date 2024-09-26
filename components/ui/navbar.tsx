import Image from "next/image";
import { Button } from "./button";
import { useRouter } from "next/navigation";
export const Navbar = () => {
  const router = useRouter();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent ">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              height={50}
              width={40}
              alt="Illustration of a person organizing tasks"
            />
            <h1 className="text-white text-3xl font-bold ml-2">TaskMaster</h1>
          </div>
          <div className="flex">
            <Button
              variant="outline"
              className="bg-black hover:bg-black hover:text-white hover:bg-opacity-65 text-white border-0 mr-2"
              onClick={() => router.push("/sign-up")}
            >
              Try TaskMaster
            </Button>
            <Button
              variant="secondary"
              className="mr-4 bg-gray-200 text-black"
              onClick={() => router.push("/sign-in")}
            >
              Log-in
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
