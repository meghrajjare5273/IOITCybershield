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
import { Checkbox } from "@/components/ui/checkbox";

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
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showMultiSelect, setShowMultiSelect] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setMessage(null);
    setSuccess(false);

    try {
      // For multi-select mode, add all selected students
      if (showMultiSelect && selectedStudents.length > 0) {
        const results = await Promise.all(
          selectedStudents.map(async (studentId) => {
            const singleFormData = new FormData();
            singleFormData.append("studentId", studentId);
            return enrollStudent(singleFormData, courseId);
          })
        );

        // Check if all enrollments were successful
        const allSuccess = results.every((result) => result.success);
        setSuccess(allSuccess);
        setMessage(
          allSuccess
            ? `Successfully enrolled ${selectedStudents.length} students`
            : "Some enrollments failed. Please try again."
        );
      } else {
        // Single student enrollment (original functionality)
        const result = await enrollStudent(formData, courseId);
        setSuccess(result.success);
        setMessage(result.message);
      }
    } catch (error) {
      console.error("Error enrolling students:", error);
      setMessage("An error occurred while enrolling students");
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }

    if (success) {
      // Reset form
      setSelectedStudents([]);

      // Force a full page reload instead of using router.refresh()
      setTimeout(() => {
        window.location.href = window.location.pathname + "?t=" + Date.now();
      }, 1000);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border shadow-sm">
      <h3 className="text-lg font-medium mb-4">Enroll Students</h3>

      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="multi-select"
            checked={showMultiSelect}
            onCheckedChange={() => {
              setShowMultiSelect(!showMultiSelect);
              setSelectedStudents([]);
            }}
          />
          <Label htmlFor="multi-select">Enable multi-student enrollment</Label>
        </div>
      </div>

      <form action={handleSubmit}>
        {showMultiSelect ? (
          <div className="space-y-4">
            <div className="max-h-60 overflow-y-auto border rounded-md p-2">
              {students.length === 0 ? (
                <p className="text-muted-foreground p-2">
                  No students available
                </p>
              ) : (
                <div className="space-y-2">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                    >
                      <Checkbox
                        id={`student-${student.id}`}
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() =>
                          toggleStudentSelection(student.id)
                        }
                      />
                      <Label htmlFor={`student-${student.id}`}>
                        {student.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              type="submit"
              disabled={
                isSubmitting || success || selectedStudents.length === 0
              }
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enrolling Students...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Enrolled Successfully
                </>
              ) : (
                `Enroll ${selectedStudents.length} Students`
              )}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full">
              <Label htmlFor="studentId">Select Student</Label>
              <Select
                name="studentId"
                value={selectedStudents[0] || ""}
                onValueChange={(value) => setSelectedStudents([value])}
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
              disabled={isSubmitting || success || !selectedStudents[0]}
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
        )}
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
