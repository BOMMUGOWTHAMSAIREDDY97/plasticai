"use client";

import { Bell, Search, UserCircle, LogOut, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const router = useRouter();
  const [authInstance, setAuthInstance] = useState(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New material batch received at Central Hub",
      time: "2 mins ago",
      read: false,
      type: "primary"
    },
    {
      id: 2,
      title: "System detected anomaly in collection flow",
      time: "1 hour ago",
      read: false,
      type: "primary"
    },
    {
      id: 3,
      title: "Daily capacity report generated",
      time: "5 hours ago",
      read: true,
      type: "secondary"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const removeNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  useEffect(() => {
    let isMounted = true;
    let unsubscribe = null;

    // Dynamically import Firebase to avoid server-side rendering issues
    import("../firebaseConfig").then(({ auth }) => {
      setAuthInstance(auth);
      import("firebase/auth").then(({ onAuthStateChanged }) => {
        if (!isMounted) return;
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          if (!isMounted) return;
          if (currentUser) {
            setUser({
              name: currentUser.displayName || currentUser.email.split("@")[0],
              email: currentUser.email,
              photoURL: currentUser.photoURL
            });
          } else {
            setUser(null);
          }
        });
      });
    });

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    if (authInstance) {
      const { signOut } = await import("firebase/auth");
      await signOut(authInstance);
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  return (
    <header className="h-20 border-b border-glassBorder bg-surface/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50">
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
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              if (isDropdownOpen) setIsDropdownOpen(false);
            }}
            className="relative text-textSecondary hover:text-textPrimary transition-colors focus:outline-none"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-danger rounded-full border-2 border-surface"></span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-surface border border-glassBorder rounded-lg shadow-xl overflow-hidden py-1 z-50">
              <div className="px-4 py-3 border-b border-glassBorder flex items-center justify-between">
                <h3 className="font-semibold text-textPrimary">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-primary hover:underline focus:outline-none">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-textSecondary">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`px-4 py-3 border-b border-glassBorder/50 hover:bg-white/5 cursor-pointer transition-colors relative group ${!notif.read ? 'bg-white/5' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${!notif.read ? 'bg-primary' : 'bg-transparent border border-textSecondary'}`}></div>
                        <div className="flex-1 pr-4">
                          <p className={`text-sm ${!notif.read ? 'text-textPrimary font-medium' : 'text-textSecondary'}`}>{notif.title}</p>
                          <p className="text-xs text-textSecondary mt-1">{notif.time}</p>
                        </div>
                        <button 
                          onClick={(e) => removeNotification(notif.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-textSecondary hover:text-danger absolute right-4 top-1/2 -translate-y-1/2 transition-opacity focus:outline-none text-xl"
                          title="Dismiss"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2 border-t border-glassBorder text-center">
                <button 
                  onClick={() => router.push("/dashboard/reports")}
                  className="text-xs font-medium text-primary hover:underline focus:outline-none"
                >
                  View all reports
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
              if (isNotificationsOpen) setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-3 pl-6 border-l border-glassBorder focus:outline-none text-left"
          >
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-textPrimary">
                {user ? user.name : "Loading..."}
              </p>
              <p className="text-xs text-textSecondary">
                {user ? user.email : ""}
              </p>
            </div>
            {user && user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-glassBorder object-cover" />
            ) : (
              <UserCircle className="w-10 h-10 text-textSecondary hover:text-primary transition-colors" />
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-surface border border-glassBorder rounded-lg shadow-xl overflow-hidden py-1 z-50">
              <div className="px-4 py-2 border-b border-glassBorder md:hidden">
                <p className="text-sm font-semibold text-textPrimary truncate">{user?.name}</p>
                <p className="text-xs text-textSecondary truncate">{user?.email}</p>
              </div>
              <button 
                onClick={() => {
                  setIsDropdownOpen(false);
                  router.push("/dashboard/profile");
                }}
                className="w-full px-4 py-2 text-sm text-textSecondary hover:bg-white/5 hover:text-textPrimary flex items-center gap-2 transition-colors"
              >
                <User className="w-4 h-4" /> Profile
              </button>
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-danger hover:bg-danger/10 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
