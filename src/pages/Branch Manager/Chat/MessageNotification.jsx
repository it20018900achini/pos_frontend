import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MessageNotification() {
  const [unseenCount, setUnseenCount] = useState(0);

  const fetchUnseenCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        "http://localhost:5000/api/chat/unseen/count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) return;

      const count = await res.json();
      setUnseenCount(count);
    } catch (err) {
      console.error("Failed to fetch unseen messages count", err);
    }
  };

  useEffect(() => {
    fetchUnseenCount();

    // 🔁 refresh every 5 seconds
    const interval = setInterval(fetchUnseenCount, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link to="/chat" className="relative inline-block">
      {/* 💬 Message Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7 text-gray-700 hover:text-black"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 20l1.2-3.6A7.91 7.91 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>

      {/* 🔴 Unseen Badge */}
      {unseenCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          {unseenCount > 99 ? "99+" : unseenCount}
        </span>
      )}
    </Link>
  );
}
