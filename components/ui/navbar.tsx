import Image from "next/image";
import { Button } from "./button";
export const Navbar = () => {
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
            <Button variant="outline" className="mr-4">
              Sign-up
            </Button>
            <Button variant="secondary">Log-in</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
