"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";



import axios from "axios";
import PostForm from "@/components/PostForm/PostForm";
import PostCard from "@/components/PostCard/PostCard";


export default function Dashboard() {
  const { user } = useUserStore();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/api/posts/user/${user._id}`)
        .then((res) => setPosts(res.data));
    }
  
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Your Posts</h2>
      <PostForm onPostCreated={(newPost) => setPosts([newPost, ...posts])} />
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
