"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";

interface StudentSearchProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export function StudentSearch({
  onSearch,
  initialValue = "",
}: StudentSearchProps) {
  const [search, setSearch] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  };

  return (
    <Input
      type="text"
      placeholder="Search students..."
      value={search}
      onChange={handleChange}
      className="mb-4"
    />
  );
}
