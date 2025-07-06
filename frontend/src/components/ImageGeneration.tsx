"use client";
import { useState, useEffect } from "react";
import styles from "./ImageGenerationDemo.module.css"; // Import the CSS module
import Image from "next/image";

interface ImageGenerationDemoProps {
  text: string;
}

export default function ImageGenerationDemo({
  text,
}: ImageGenerationDemoProps) {
  const width = 1024;
  const height = 1024;
  const basePrompt =
    "Create a highly detailed and vibrant image in the style of art nouveau that captures the following scene from a story:";

  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function generateImage() {
      try {
        if (text === "") {
          setImageUrl("");
          return;
        }

        setIsLoading(true);
        setError("");

        const response = await fetch('/api/generateImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            text: text,
            width: width,
            height: height
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Image generation failed');
        }

        const data = await response.json();
        console.log(`Generated image URL: ${data.imageUrl}`);
        setImageUrl(data.imageUrl);
        
      } catch (error: any) {
        console.error("Error generating image:", error);
        setError(error.message || "Failed to generate image");
        setImageUrl("");
      } finally {
        setIsLoading(false);
      }
    }

    generateImage();
  }, [text]); // The effect runs when 'text' changes

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        <p>{basePrompt + text}</p> {/* Display the prompt dynamically */}
      </div>
      
      {isLoading && (
        <div className={styles.loading}>
          <p>Generating image...</p>
          <div className={styles.spinner}></div>
        </div>
      )}
      
      {error && !isLoading && (
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      )}
      
      {imageUrl && !isLoading && !error ? (
        <Image
          className={styles.image}
          src={imageUrl}
          width={width}
          height={height}
          alt="Generated"
        />
      ) : !isLoading && !error && text && (
        <p>No image generated</p>
      )}
    </div>
  );
}