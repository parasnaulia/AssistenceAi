"use client";
import Image from "next/image";
import MidSection from "./Components/LandingPage/MidSection";
import Footer from "./Components/LandingPage/Footer";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("auth");
  };
  return (
    
    <div className=" ">
      <div className="flex justify-between items-center bg-blue-950 p-3">
        <div>
          <Image src="/logo.png" alt="Logo" height={20} width={30} />
        </div>
        <div>
          <button
            onClick={handleClick}
            className="p-2 bg-amber-900 font-bold cursor-pointer"
          >
            Sign up
          </button>
        </div>
      </div>
      <div>
        <MidSection />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
