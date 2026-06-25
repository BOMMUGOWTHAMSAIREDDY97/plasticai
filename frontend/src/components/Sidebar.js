import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Camera, BarChart2, FileText, Settings, LogOut, Leaf } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Live Camera", href: "/dashboard/camera", icon: Camera },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-glassBorder bg-surface/50 backdrop-blur-xl h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-2 border-b border-glassBorder">
        <Leaf className="w-6 h-6 text-primary" />
        <span className="text-xl font-bold tracking-tight">PlasticVision</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
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
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-danger hover:bg-danger/10 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
