"use client";

import { useState, type FormEvent } from "react";
import { saveCourseAttendance } from "@/actions/attendance-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Download,
  Save,
  ArrowLeft,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface Student {
  id: string;
  name: string;
  rollno: string;
  present: boolean;
}

interface Session {
  date: Date;
  courseName: string;
}

interface AttendanceClientProps {
  session: Session;
  students: Student[];
  sessionId: string;
  courseId: string;
}

export function AttendanceClient({
  session,
  students: initialStudents,
  sessionId,
  courseId,
}: AttendanceClientProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    const formData = new FormData();
    students.forEach((student) => {
      if (student.present) formData.append(`attendance-${student.id}`, "on");
    });

    try {
      const result = await saveCourseAttendance(formData, sessionId);
      setSaving(false);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          // Force a full page reload instead of using router.refresh()
          window.location.href = window.location.pathname + "?t=" + Date.now();
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setSaving(false);
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    }
  };

  const markAllPresent = () => {
    setStudents(students.map((student) => ({ ...student, present: true })));
  };

  const markAllAbsent = () => {
    setStudents(students.map((student) => ({ ...student, present: false })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href={`/admin/courses/${courseId}`}>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            <span>Back to Course</span>
          </Button>
        </Link>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-950 dark:to-gray-900 rounded-t-xl">
          <CardTitle className="text-xl md:text-2xl">
            Attendance: {session.courseName}
          </CardTitle>
          <p className="text-muted-foreground">
            Session Date: {new Date(session.date).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">
                {students.filter((s) => s.present).length} of {students.length}{" "}
                students marked present
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={markAllPresent}
                >
                  Mark All Present
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={markAllAbsent}
                >
                  Mark All Absent
                </Button>
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="py-3 px-4 text-left">Student</th>
                      <th className="py-3 px-4 text-left">Roll No</th>
                      <th className="py-3 px-4 text-center">Present</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => (
                      <tr
                        key={student.id}
                        className={cn(
                          "transition-colors",
                          index % 2 === 0 ? "bg-background" : "bg-muted/20",
                          student.present && "bg-green-50 dark:bg-green-950/20"
                        )}
                      >
                        <td className="py-3 px-4 font-medium">
                          {student.name}
                        </td>
                        <td className="py-3 px-4">{student.rollno}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center">
                            <Checkbox
                              id={student.id}
                              checked={student.present}
                              onCheckedChange={(checked) =>
                                setStudents((prev) =>
                                  prev.map((s) =>
                                    s.id === student.id
                                      ? { ...s, present: !!checked }
                                      : s
                                  )
                                )
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {error && (
              <div className="flex items-center text-red-600 text-sm">
                <AlertCircle className="mr-2 h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <a
                href={`/api/courses/${courseId}/sessions/${sessionId}/attendance.xlsx`}
                download
              >
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Download size={16} />
                  <span>Download Excel</span>
                </Button>
              </a>

              <Button
                type="submit"
                disabled={saving || success}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle size={16} />
                    <span>Saved Successfully</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Attendance</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
