"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { enrollStudent } from "@/actions/enrollment-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

export function EnrollmentForm({
  courseId,
  students,
}: {
  courseId: string;
  students: { id: string; name: string }[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [studentId, setStudentId] = useState<string>("");

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setMessage(null);
    setSuccess(false);

    const result = await enrollStudent(formData, courseId);
    setIsSubmitting(false);
    setMessage(result.message);

    if (result.success) {
      setSuccess(true);
      setStudentId(""); // Reset form

      // Force a full page reload instead of using router.refresh()
      setTimeout(() => {
        window.location.href = window.location.pathname + "?t=" + Date.now();
      }, 1000);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
      <h3 className="text-lg font-medium mb-4">Enroll New Student</h3>

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
            disabled={isSubmitting || success || !studentId}
            className="self-end mt-2 sm:mt-0 w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enrolling...
              </>
            ) : success ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Enrolled Successfully
              </>
            ) : (
              "Enroll Student"
            )}
          </Button>
        </div>
        {message && (
          <div
            className={`flex items-center mt-2 text-sm ${
              success ? "text-green-600" : "text-red-600"
            }`}
          >
            {success ? (
              <CheckCircle className="mr-2 h-4 w-4" />
            ) : (
              <AlertCircle className="mr-2 h-4 w-4" />
            )}
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
