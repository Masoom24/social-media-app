"use client";

import { useState } from "react";
import axios from "axios";
import { useUserStore } from "@/store/useUserStore";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function PostForm({ onPostCreated }) {
  const [text, setText] = useState("");
  const { user } = useUserStore();
  const [image, setImage]= useState(null)
  const [showMessage, setShowMessage]= useState(false)

const handleSubmit = async () => {
  if (!user?._id) {
    alert("User not logged in");
    return;
  }
 

    if (!text.trim()) {
      setShowMessage(true);

      // Hide the message after 3 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return;
    }

  try {
    const res = await axios.post("http://localhost:5000/api/posts/create", {
      content:text,         
      celebrityId: user._id,  
      image: null,   
    });

    setText("");
    setImage(null);
    if (onPostCreated) onPostCreated(res.data);
  } catch (error) {
    console.error("Post creation failed:", error);
  }
};
  return (
     <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 border">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Create a Post
      </h2>
      
    {showMessage && (
        <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-300 text-black p-3 rounded transition-all duration-500 ease-in-out">
           Post content cannot be empty!
        </div>
      )}
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full resize-none border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
            required

      />

      <div className="flex justify-end mt-4">
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
        >
          Post
        </Button>
        
      </div>
     
    </div>
  );
}
