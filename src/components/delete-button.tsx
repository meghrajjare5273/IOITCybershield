"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { deleteStudent } from "@/actions/student-actions";
import { Trash2, Loader2, AlertCircle } from "lucide-react";

interface DeleteButtonProps {
  studentId: string;
}

export function DeleteButton({ studentId }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteStudent(studentId);
      setIsDeleting(false);

      if (result.success) {
        // Force a full page reload instead of using router.refresh()
        window.location.href = window.location.pathname + "?t=" + Date.now();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setIsDeleting(false);
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <div>
      <Button
        onClick={handleDelete}
        variant="destructive"
        disabled={isDeleting}
        className="flex items-center gap-1"
      >
        {isDeleting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Deleting...</span>
          </>
        ) : (
          <>
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </>
        )}
      </Button>
      {error && (
        <div className="flex items-center text-red-600 text-sm mt-1">
          <AlertCircle className="mr-1 h-3 w-3" />
          {error}
        </div>
      )}
    </div>
  );
}
