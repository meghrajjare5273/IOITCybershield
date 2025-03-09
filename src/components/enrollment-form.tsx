"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { enrollStudent } from "@/actions/enrollment-actions";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Simple Spinner component
const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={`animate-spin h-5 w-5 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    />
  </svg>
);

export function EnrollmentForm({
  courseId,
  students,
}: {
  courseId: string;
  students: { id: string; name: string }[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setMessage(null);
    const result = await enrollStudent(formData, courseId);
    setIsSubmitting(false);
    setMessage(result.message);
    if (result.success) {
      setStudentId(""); // Reset form
      router.refresh(); // Refresh page to update server data
    }
  };

  return (
    <form action={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full">
          <Label htmlFor="studentId">Select Student</Label>
          <Select
            name="studentId"
            value={studentId}
            onValueChange={setStudentId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {students.length === 0 ? (
                <SelectItem value="none" disabled>
                  No students available
                </SelectItem>
              ) : (
                students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || !studentId}
          className="self-end mt-2 sm:mt-0 w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <Spinner className="mr-2" />
              Enrolling...
            </>
          ) : (
            "Enroll Student"
          )}
        </Button>
      </div>
      {message && (
        <p className="text-sm text-muted-foreground mt-2">{message}</p>
      )}
    </form>
  );
}
