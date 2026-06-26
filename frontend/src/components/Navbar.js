"use client";

import { Bell, Search, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Dynamically import Firebase to avoid server-side rendering issues
    import("../firebaseConfig").then(({ auth }) => {
      import("firebase/auth").then(({ onAuthStateChanged }) => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            setUser({
              name: currentUser.displayName || currentUser.email.split("@")[0],
              email: currentUser.email,
              photoURL: currentUser.photoURL
            });
          }
        });
        return () => unsubscribe();
      });
    });
  }, []);

  return (
    <header className="h-20 border-b border-glassBorder bg-surface/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
          <input
            type="text"
            placeholder="Search detections, reports..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-glassBorder rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-textSecondary hover:text-textPrimary transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-danger rounded-full border-2 border-surface"></span>
        </button>
        <div className="flex items-center gap-3 pl-6 border-l border-glassBorder">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-textPrimary">
              {user ? user.name : "Loading..."}
            </p>
            <p className="text-xs text-textSecondary">
              {user ? user.email : ""}
            </p>
          </div>
          {user && user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-glassBorder" />
          ) : (
            <UserCircle className="w-10 h-10 text-textSecondary" />
          )}
        </div>
      </div>
    </header>
  );
}
