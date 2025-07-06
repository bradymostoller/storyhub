"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface TranscribeProps {
  text: string;
  imageUrl: string | null; 
  width: number;
  height: number;
  onRegenerate: () => void;
}

export default function Picture({
  text,
  imageUrl,
  width,
  height,
  onRegenerate,
}: TranscribeProps) {
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (imageUrl) {
      setLoading(false); 
    }
  }, [imageUrl]);

  return (
    <div className="relative bg-white w-[50%] h-[100%] rounded-xl overflow-hidden">
      <div className="flex flex-col items-center justify-center p-4 h-full">
        {loading || !imageUrl ? (
          
          <div className="flex items-center justify-center h-full w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>{" "}
            {/* Tailwind spinner */}
          </div>
        ) : (
          
          <Image
            src={imageUrl}
            alt={text}
            width={width}
            height={height}
            className="object-contain w-7/8 h-5/8 rounded-xl"
          />
        )}
      </div>
      <button
        className="absolute bottom-0 right-0 mb-4 mr-4 text-3xl font-black text-white bg-[#8E60C0] hover:bg-[#7D4FAF] px-4 py-2 rounded-full"
        onClick={() => {
          setLoading(true); 
          onRegenerate();
        }}
      >
        Regenerate
      </button>
    </div>
  );
}
