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
} from "@/components/ui/select"; // Assuming you have a Select component from Shadcn

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
      setStudentId("");
      router.refresh();
    }
  };

  return (
    <form action={handleSubmit}>
      <div className="flex space-x-4">
        <div>
          <Label htmlFor="studentId">Select Student</Label>
          <Select name="studentId" value={studentId} onValueChange={setStudentId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a student" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={isSubmitting || !studentId} className="self-end">
          {isSubmitting ? "Enrolling..." : "Enroll Student"}
        </Button>
      </div>
      {message && <p className="text-sm text-muted-foreground mt-2">{message}</p>}
    </form>
  );
}