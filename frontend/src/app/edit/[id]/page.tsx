"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useParams } from "next/navigation";

interface Page {
  text: string;
  imageUrl: string;
}

export default function EditFable() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchFable();
    }
  }, [id]);

  const fetchFable = async () => {
    try {
      const response = await fetch(`http://localhost:3001/books/${id}`);
      const data = await response.json();
      setTitle(data.title);
      setDescription(data.description);
      setPages(data.pages || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching fable:", error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3001/books/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          pages,
        }),
      });

      if (response.ok) {
        router.push("/dashboard"); 
      }
    } catch (error) {
      console.error("Error updating fable:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Fable</h1>
      
      <div className="max-w-4xl mx-auto">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-4 mb-4 bg-white text-black rounded"
          placeholder="Title"
        />
        
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-4 mb-4 bg-white text-black rounded"
          placeholder="Description"
          rows={3}
        />
        
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="bg-[#A260DB] hover:bg-[#8E60C0] px-6 py-3 rounded text-white"
          >
            Save Changes
          </button>
          
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}