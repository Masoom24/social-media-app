// "use client";

// import { useEffect, useState } from "react";
// import useUserStore from "@/store/useUserStore";
// import axios from "axios";
// import PostCard from "@/components/PostCard/PostCard";

// export default function Home() {
//   const { user } = useUserStore();
//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);

//   const loadMore = async () => {
//     const res = await axios.get(
//       `http://localhost:5000/api/posts/feed?userId=${user._id}&page=${page}`
//     );
//     setPosts((prev) => [...prev, ...res.data]);
//     setPage(page + 1);
//   };

//   useEffect(() => {
//     if (user) loadMore();
//   }, [user]);

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl mb-4">Feed</h2>
//       {posts.map((post) => (
//         <PostCard key={post._id} post={post} />
//       ))}
//       <button onClick={loadMore} className="bg-blue-600 text-white p-2 mt-4">
//         Load More
//       </button>
//     </div>
//   );
// }
import Home from "@/components/publics";
import React from "react";

const page = () => {
  return (
    <div>
      <Home />
    </div>
  );
};

export default page;
