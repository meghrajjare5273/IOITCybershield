"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export function StudentSearch() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handler = setTimeout(() => {
      router.push(`/admin/students?search=${encodeURIComponent(search)}`);
    }, 300); // Debounce by 300ms

    return () => {
      clearTimeout(handler); // Cleanup timeout on unmount or search change
    };
  }, [search, router]);

  return (
    <Input
      type="text"
      placeholder="Search students..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="mb-4" // Optional styling for spacing
    />
  );
}
