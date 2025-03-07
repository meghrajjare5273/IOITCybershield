"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteStudent } from "@/actions/student-actions";

interface DeleteButtonProps {
  studentId: string;
}

export function DeleteButton({ studentId }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    setIsDeleting(true);
    setError(null);

    const result = await deleteStudent(studentId);
    setIsDeleting(false);

    if (result.success) {
      router.refresh();
    } else {
      setError(result.message);
    }
  };

  return (
    <div>
      <Button onClick={handleDelete} variant="destructive" disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}