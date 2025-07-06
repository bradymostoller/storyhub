"use client";

import Picture from "../../components/Picture";
import { useState, useRef } from "react";

interface StoryItem {
  text: string;
  imageUrl: string;
}

export default function CreateStory() {
  const [inputText, setInputText] = useState("");
  const [currentStory, setCurrentStory] = useState<StoryItem[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const width = 1024;
  const height = 1024;

  const generateImage = async () => {
    try {
      if (inputText === "") return;

      setIsGeneratingImage(true);
      setIsDisabled(true);

      const response = await fetch("/api/generateImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          width,
          height,
        }),
      });

      if (!response.ok) {
        throw new Error("Image generation failed");
      }

      const data = await response.json();
      console.log(`Generated image URL: ${data.imageUrl}`);
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGeneratingImage(false);
      setIsDisabled(false);
    }
  };

  const handleNewPage = () => {
    if (inputText.trim() === "") return;

    setCurrentStory([...currentStory, { text: inputText, imageUrl }]);
    setInputText("");
    setImageUrl("");
  };

  const handleSaveStory = () => {
    const data = {
      userId: localStorage.getItem("token"),
      title,
      description,
      pages: currentStory,
    };

    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setCurrentStory([]);
        setIsModalOpen(false);
        window.history.pushState(null, "", "/dashboard");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="bg-[#1E1E1E] h-screen w-screen items-center justify-center flex flex-col">
      <div className="flex gap-10 w-screen px-[10%] h-[70%] justify-center items-center mt">
        {/* Text input area */}
        <div className="w-full h-full flex flex-col">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe the scene you want to generate..."
            className="w-full h-full p-4 text-white bg-[#2E2E2E] rounded-lg resize-none"
          />
          <div className="flex gap-4 mt-4">
            <button
              onClick={generateImage}
              disabled={isDisabled || inputText.trim() === ""}
              className="px-6 py-2 rounded-full text-xl font-black text-white bg-[#8E60C0] disabled:opacity-50"
            >
              Generate Image
            </button>
            <button
              onClick={handleNewPage}
              disabled={isDisabled || !imageUrl}
              className="px-6 py-2 rounded-full text-xl font-black text-white bg-[#5C8EC0] disabled:opacity-50"
            >
              Add Page
            </button>
          </div>
        </div>

        {/* Picture container */}
        <div className="relative w-full h-full">
          {isGeneratingImage && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
              <div className="text-white text-xl">Generating image...</div>
            </div>
          )}

          <Picture
            text={inputText}
            imageUrl={imageUrl}
            width={width}
            height={height}
            onRegenerate={generateImage}
          />
        </div>
      </div>

      {/* Save button */}
      {currentStory.length > 0 && !isDisabled && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-3xl font-black text-white mt-4"
        >
          Save Story
        </button>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white p-8 rounded-lg w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Save Your Story</h2>
            <input
              type="text"
              placeholder="Enter story title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <textarea
              placeholder="Enter story description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStory}
                disabled={!title || !description}
                className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
              >
                Confirm Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
