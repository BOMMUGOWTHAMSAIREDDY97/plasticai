"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, Camera, BarChart2, FileText, Settings, LogOut, Leaf } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState("operator");

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    
    try {
      const { auth } = await import("../../firebaseConfig");
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
    } catch (error) {
      console.error("Firebase logout error:", error);
    }
    
    router.push("/login");
  };

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Live Camera", href: "/dashboard/camera", icon: Camera },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "My Profile", href: "/dashboard/profile", icon: Leaf },
    ...(role === "admin" ? [{ name: "Admin Panel", href: "/dashboard/admin", icon: LayoutDashboard }] : []),
  ];

  return (
    <aside className="w-64 border-r border-glassBorder bg-surface/50 backdrop-blur-xl h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-2 border-b border-glassBorder">
        <Leaf className="w-6 h-6 text-primary" />
        <span className="text-xl font-bold tracking-tight">PlasticVision</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-textSecondary hover:bg-surfaceHover hover:text-textPrimary"
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-glassBorder">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-danger hover:bg-danger/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
