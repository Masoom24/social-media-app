"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import socket from "@/utils/socket";

export default function CelebrityProfilePage() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [celebrity, setCelebrity] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch celebrity info
  useEffect(() => {
    const fetchCelebrity = async () => {
      try {
        const celebRes = await axios.get(`http://localhost:5000/api/users/celebrities?userId=${id}`);
        const found = celebRes.data.find((c) => c._id === id);
        setCelebrity(found);
      } catch (err) {
        console.error("Error fetching celebrity:", err);
      }
    };
    if (id) fetchCelebrity();
  }, [id]);
// In your CelebrityProfilePage component
useEffect(() => {
  if (!id) return;

  // Connect socket
  socket.connect();

  // Handle connection event
  const onConnect = () => {
    console.log('Socket connected');
    socket.emit("joinCelebrityRoom", id);
  };

  // Handle new posts
  const onNewPost = (newPost) => {
    const postWithDefaults = {
      ...newPost,
      isLiked: false,
      likeCount: newPost.likes || 0,
      showComments: false,
      comments: [],
      newComment: ''
    };
    setPosts((prev) => [postWithDefaults, ...prev]);
  };

  socket.on('connect', onConnect);
  socket.on('newPost', onNewPost);

  // Cleanup
  return () => {
    socket.off('connect', onConnect);
    socket.off('newPost', onNewPost);
    socket.disconnect();
  };
}, [id]);


  const fetchMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await axios.get(`http://localhost:5000/api/posts/user/${id}?page=${page}&limit=5`);
      const newPosts = res.data.map(post => ({
        ...post,
        // Initialize post-specific states
        isLiked: false,
        likeCount: post.likes || 0, // Use server-side likes if available
        showComments: false,
        comments: []
      }));
      
      setPosts((prev) => [...prev, ...newPosts]);
      setPage((prev) => prev + 1);
      setHasMore(newPosts.length === 5);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, id]);

  // Initial load when component mounts or id changes
  useEffect(() => {
    if (id) {
      setPosts([]);
      setPage(1);
      setHasMore(true);
      fetchMorePosts();
    }
  }, [id]);

  const handleShare = async (postId) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/post/${postId}`
      );
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post._id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1
        };
      }
      return post;
    }));
  };

  const toggleComments = (postId) => {
    setPosts(posts.map(post => {
      if (post._id === postId) {
        return {
          ...post,
          showComments: !post.showComments
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId, newComment) => {
    if (newComment.trim()) {
      setPosts(posts.map(post => {
        if (post._id === postId) {
          const comment = {
            id: Date.now(),
            text: newComment,
            user: { name: "You" },
            createdAt: new Date().toISOString()
          };
          return {
            ...post,
            comments: [...post.comments, comment],
            newComment: ''
          };
        }
        return post;
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      {celebrity ? (
        <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
            {celebrity.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{celebrity.name}</h1>
            <p className="text-sm text-gray-500">@{celebrity.username || celebrity.name.toLowerCase().replace(/\s/g, '')}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMorePosts}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
        endMessage={
          <div className="text-center py-8 text-gray-500">
            You've reached the end of {celebrity?.name || "this celebrity"}'s posts
          </div>
        }
      >
        <div className="space-y-5">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
              {/* Post Header */}
              <div className="flex items-center p-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold mr-3">
                  {celebrity?.name.charAt(0) || "C"}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{celebrity?.name || "Celebrity"}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-4 pb-3">
                {post.text && (
                  <p className="text-gray-800 whitespace-pre-line mb-3">{post.text}</p>
                )}
              </div>

              {/* Post Image */}
              {post.image && (
                <div className="border-t border-b border-gray-100">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-auto max-h-[500px] object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Post Actions */}
              <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                <div className="flex space-x-4">
                  <button 
                    className="flex items-center text-gray-500 hover:text-blue-500 transition-colors"
                    onClick={() => handleLike(post._id)}
                  >
                    <svg 
                      className="w-5 h-5 mr-1" 
                      fill={post.isLiked ? "currentColor" : "none"} 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className="text-sm">{post.likeCount} Like{post.likeCount !== 1 ? 's' : ''}</span>
                  </button>
                  <button 
                    className="flex items-center text-gray-500 hover:text-green-500 transition-colors"
                    onClick={() => toggleComments(post._id)}
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm">
                      {post.comments.length} Comment{post.comments.length !== 1 ? 's' : ''}
                    </span>
                  </button>
                </div>
                <button 
                  onClick={() => handleShare(post._id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="text-sm">Share</span>
                </button>
              </div>

              {/* Comments Section */}
              {post.showComments && (
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                  <div className="mb-4 space-y-3">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                          {comment.user.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <p className="font-medium text-sm">{comment.user.name}</p>
                            <p className="text-gray-800 text-sm">{comment.text}</p>
                            <p className="text-gray-500 text-xs mt-1">
                              {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      onChange={(e) => {
                        const value = e.target.value;
                        setPosts(posts.map(p => 
                          p._id === post._id ? {...p, newComment: value} : p
                        ));
                      }}
                      value={post.newComment || ''}
                    />
                    <button
                      onClick={() => handleAddComment(post._id, post.newComment)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}