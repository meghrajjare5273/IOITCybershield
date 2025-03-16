"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
  Shield,
} from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  subItems?: { label: string; href: string }[];
  onClick?: () => void;
}

const SidebarItem = ({
  icon,
  label,
  href,
  active,
  subItems,
  onClick,
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
          } else if (onClick) {
            onClick();
          }
        }}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200",
          active
            ? "bg-primary text-primary-foreground font-medium shadow-sm"
            : "hover:bg-accent hover:translate-x-1"
        )}
      >
        {icon}
        <span className="flex-1">{label}</span>
        {subItems?.length &&
          (expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />)}
      </Link>

      {subItems?.length && expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="ml-8 mt-1 space-y-1 overflow-hidden"
        >
          {subItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClick}
              className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Close sidebar on mobile when clicking a link
  const handleMobileLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b bg-card z-10 sticky top-0">
        <div className="flex items-center">
          <Shield className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-xl font-bold text-primary">CyberShield</h1>
        </div>
        <button
          className="p-2 rounded-md hover:bg-accent transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{
              x: isMobile ? -280 : 0,
              opacity: isMobile ? 0 : 1,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: isMobile ? -280 : 0,
              opacity: isMobile ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
            className={cn(
              "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r shadow-sm md:relative",
              isMobile ? "top-[57px] pt-2" : "pt-0"
            )}
          >
            {!isMobile && (
              <div className="p-4 border-b flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                <div>
                  <h1 className="text-xl font-bold text-primary">
                    CyberShield
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Attendance System
                  </p>
                </div>
              </div>
            )}

            <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] md:max-h-[calc(100vh-140px)]">
              <SidebarItem
                icon={<Home size={20} />}
                label="Dashboard"
                href="/admin"
                active={pathname === "/admin"}
                onClick={handleMobileLinkClick}
              />
              <SidebarItem
                icon={<Users size={20} />}
                label="Students"
                href="/admin/students"
                active={pathname.startsWith("/admin/students")}
                onClick={handleMobileLinkClick}
                subItems={[
                  { label: "Add Student", href: "/admin/students?view=manage" },
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
                onClick={handleMobileLinkClick}
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
                onClick={handleMobileLinkClick}
              />
              <SidebarItem
                icon={<BarChart size={20} />}
                label="Reports"
                href="/admin/reports"
                active={pathname.startsWith("/admin/reports")}
                onClick={handleMobileLinkClick}
              />
            </nav>

            <div className="absolute bottom-0 w-full p-4 border-t">
              <LogoutButton className="w-full justify-start gap-2 hover:bg-red-50 hover:text-red-600 transition-colors">
                <LogOut size={18} />
                <span>Logout</span>
              </LogoutButton>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto pt-4">
        {children}
      </main>
    </div>
  );
}
