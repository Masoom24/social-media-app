"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import axios from "axios";
import NotificationBell from "../NotificationBell";

export default function Home() {
  const router = useRouter();
  const { user } = useUserStore();
  const { logout } = useUserStore();
  const [celebrities, setCelebrities] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [unfollowConfirmId, setUnfollowConfirmId] = useState(null);
  const userId = useUserStore((state) => state.user?._id);

  useEffect(() => {
    const fetchCelebrities = async () => {
      if (!user?._id) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/celebrities?userId=${user._id}`
        );
        console.log("object", res.data);
        console.log("Name of first celeb:", res.data[0]?.name);

        setCelebrities(res.data);
      } catch (error) {
        console.error("Failed to load celebrities:", error);
      }
    };
    fetchCelebrities();
  }, [user]);
  const handleFollow = async (celebrityId, celebrityName, isFollowing) => {
    if (!user?._id) {
      console.error("User not logged in.");
      return;
    }

    if (isFollowing) {
      setUnfollowConfirmId(celebrityId);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users/follow", {
        userId: user._id,
        celebrityId,
      });

      setCelebrities((prev) =>
        prev.map((c) =>
          c._id === celebrityId ? { ...c, isFollowing: true } : c
        )
      );

      setPopupMessage(`You are now following ${celebrityName}`);
      setTimeout(() => setPopupMessage(""), 2500);
    } catch (err) {
      console.error("Follow request failed:", err);
    }
  };

  const confirmUnfollow = async (celebrityId) => {
    try {
      await axios.post("http://localhost:5000/api/users/follow", {
        userId: user._id,
        celebrityId,
      });

      setCelebrities((prev) =>
        prev.map((c) =>
          c._id === celebrityId ? { ...c, isFollowing: false } : c
        )
      );

      setUnfollowConfirmId(null);
    } catch (err) {
      console.error("Unfollow request failed:", err);
    }
  };

  const handleNameClick = (celeb) => {
    if (celeb.isFollowing) {
      router.push(`/profile/${celeb._id}`);
    } else {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout();
    router.push("/login");
  };

  return (
    <div className="max-w-2xl mx-auto bg-[#F1F1F2] rounded-2xl shadow-lg p-6 border border-gray-200 mt-8">
      {user?.name && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Welcome, <span className="text-blue-600">{user.name}</span>
          </h1>
          <div>
            <NotificationBell />
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-4 py-1.5 text-sm rounded-lg transition"
          >
            Logout
          </button>
        </div>
      )}

      <h2 className="text-center text-2xl font-bold text-blue-600 mb-6">
        Browse Celebrities
      </h2>

      {popupMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#A1D6E2] text-green-800 border border-green-300 px-4 py-2 rounded-lg shadow transition-all">
          {popupMessage}
        </div>
      )}

      {showPopup && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded-lg shadow transition-all">
          Please follow to view posts.
        </div>
      )}

      {unfollowConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-lg text-center">
            <p className="text-lg font-semibold text-red-500 mb-4">
              Are you sure you want to unfollow?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => confirmUnfollow(unfollowConfirmId)}
                className="bg-red-500 hover:bg-red-600 text-white  cursor-pointer px-4 py-2 rounded-md transition"
              >
                Yes, Unfollow
              </button>
              <button
                onClick={() => setUnfollowConfirmId(null)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {celebrities.length > 0 ? (
          celebrities.map((celeb) => (
            <div
              key={celeb._id}
              className="flex justify-between bg-[#A1D6E2] items-center border border-black rounded-lg px-4 py-3 hover:shadow-sm transition"
            >
              <p
                onClick={() => handleNameClick(celeb)}
                className={`text-base font-medium ${
                  celeb.isFollowing
                    ? "text-grays-800 hover:text-gray-600 cursor-pointer"
                    : "text-gray-500 cursor-not-allowed"
                }`}
              >
                {celeb.name}
              </p>

              <button
                onClick={() =>
                  handleFollow(celeb._id, celeb.name, celeb.isFollowing)
                }
                className={`text-sm px-4 py-1.5 rounded-md transition ${
                  celeb.isFollowing
                    ? "bg-[#002C54] hover:bg-red-400 text-white cursor-pointer"
                    : "bg-[#1995AD] hover:bg-[#1994ade1] text-white cursor-pointer"
                }`}
              >
                {celeb.isFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No celebrities found.</p>
        )}
      </div>
    </div>
  );
}
