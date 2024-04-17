"use client";
import Image from "next/image";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <div className="relative flex-col justify-normal ">
      <Navbar />
      <BackgroundGradientAnimation>
        <div className="absolute inset-0 flex justify-center items-center text-white font-bold px-4 pointer-events-none">
          <div className="flex flex-col md:flex-row items-center justify-center max-w-5xl mx-auto px-4">
            <div className="md:w-1/2 md:pr-8 relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4">
                Organize your tasks with ease.
              </h1>
              <p className="text-lg md:text-xl leading-relaxed text-white font-medium mb-8 hidden md:block">
                Empower your team to collaborate seamlessly, manage projects
                effortlessly, and achieve unparalleled productivity.
              </p>
              <p className="text-2xl text-yellow-300 font-bold hidden md:block">
                Unlock your team&apos;s potential.
              </p>
            </div>
            <div className="md:w-1/2 relative z-10 mt-4 md:mt-0">
              <div className="image-container">
                <Image
                  src="/landing.webp"
                  height={1000}
                  width={600}
                  objectFit="cover"
                  alt="Illustration of a person organizing tasks"
                />
              </div>
            </div>
          </div>
        </div>
      </BackgroundGradientAnimation>

      <Button
        onClick={() => router.push("/dashboard")}
        variant="link"
        className="font-serif absolute bottom-4 left-1/2 transform -translate-x-1/2 px-12 py-4 rounded-full  text-gray-100 font-bold tracking-widest uppercase "
      >
        Try TaskMaster
      </Button>
    </div>
  );
}
