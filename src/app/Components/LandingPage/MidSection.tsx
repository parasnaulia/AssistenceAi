"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface ImageItem {
  src: string;
}

const mapArrayImages: ImageItem[] = [
  { src: "/s1.jpeg" },
  { src: "/s2.jpeg" },
  { src: "/s3.jpeg" },
  { src: "/s4.jpeg" },
];

const MidSection: React.FC = () => {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % mapArrayImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-10 h-[60vh] flex flex-col items-center justify-center text-center">
      <div>
        <h1 className="text-5xl font-bold font-sans">
          Welcome to the World of AI
        </h1>
        <p className="mt-4 text-2xl font-sans">
          Begin your journey here. Ask, learn, and explore the endless
          possibilities of AI.
        </p>
      </div>
      <div className="mt-10 h-[70%]">
        <Image
          src={mapArrayImages[index].src}
          alt="Slideshow Image"
          height={600}
          width={600}
          priority
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default MidSection;
