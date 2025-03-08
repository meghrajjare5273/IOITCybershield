"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  BookOpen,
  Calendar,
  BarChart,
  Menu,
  X,
  Home,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  subItems?: { label: string; href: string }[];
}

const SidebarItem = ({
  icon,
  label,
  href,
  active,
  subItems,
}: SidebarItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-2">
      <Link
        href={href}
        onClick={(e) => {
          if (subItems?.length) {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          active ? "bg-primary text-primary-foreground" : "hover:bg-accent"
        )}
      >
        {icon}
        <span className="flex-1">{label}</span>
        {subItems?.length &&
          (expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />)}
      </Link>

      {subItems?.length && expanded && (
        <div className="ml-8 mt-1 space-y-1">
          {subItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-sm rounded-md hover:bg-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed z-50 bottom-4 right-4 p-2 rounded-full bg-primary text-primary-foreground md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="fixed inset-y-0 left-0 z-40 w-64 bg-card border-r shadow-sm md:relative"
          >
            <div className="p-4 border-b">
              <h1 className="text-xl font-bold text-primary">CyberShield</h1>
              <p className="text-sm text-muted-foreground">Attendance System</p>
            </div>

            <nav className="p-4 space-y-1">
              <SidebarItem
                icon={<Home size={20} />}
                label="Dashboard"
                href="/admin"
                active={pathname === "/admin"}
              />
              <SidebarItem
                icon={<Users size={20} />}
                label="Students"
                href="/admin/students"
                active={pathname.startsWith("/admin/students")}
                subItems={[
                  { label: "Add Student", href: "/admin/students?view=add" },
                  {
                    label: "Search Students",
                    href: "/admin/students?view=search",
                  },
                  {
                    label: "Attendance Reports",
                    href: "/admin/students?view=reports",
                  },
                ]}
              />
              <SidebarItem
                icon={<BookOpen size={20} />}
                label="Courses"
                href="/admin/courses"
                active={pathname.startsWith("/admin/courses")}
                subItems={[
                  { label: "Add Course", href: "/admin/courses?view=add" },
                  {
                    label: "Manage Courses",
                    href: "/admin/courses?view=manage",
                  },
                ]}
              />
              <SidebarItem
                icon={<Calendar size={20} />}
                label="Sessions"
                href="/admin/sessions"
                active={pathname.startsWith("/admin/sessions")}
              />
              <SidebarItem
                icon={<BarChart size={20} />}
                label="Reports"
                href="/admin/reports"
                active={pathname.startsWith("/admin/reports")}
              />
            </nav>

            <div className="absolute bottom-0 w-full p-4 border-t">
              <LogoutButton className="w-full justify-start gap-2">
                <LogOut size={18} />
                <span>Logout</span>
              </LogoutButton>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  );
}
