"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { saveCourseAttendance } from "@/actions/attendance-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    students.forEach((student) => {
      if (student.present) formData.append(`attendance-${student.id}`, "on");
    });
    const result = await saveCourseAttendance(formData, sessionId);
    setSaving(false);
    if (result.success) router.refresh();
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          <h1 className="text-2xl font-bold mb-4">
            {session.courseName} - {new Date(session.date).toLocaleDateString()}
          </h1>

          <div className="space-y-2">
            {students.map((student: Student) => (
              <div
                key={student.id}
                className="flex items-center gap-2 p-2 border-b"
              >
                <Checkbox
                  id={student.id}
                  checked={student.present}
                  onCheckedChange={(checked) =>
                    setStudents((prev) =>
                      prev.map((s) =>
                        s.id === student.id ? { ...s, present: !!checked } : s
                      )
                    )
                  }
                />
                <label
                  htmlFor={student.id}
                  className="ml-2 text-sm font-medium"
                >
                  {student.name} ({student.rollno})
                </label>
              </div>
            ))}
          </div>

          <Button type="submit" disabled={saving} className="mt-4">
            {saving ? "Saving..." : "Save Attendance"}
          </Button>
        </form>
      </div>

      <div>
        <a
          href={`/api/courses/${courseId}/sessions/${sessionId}/attendance.xlsx`}
          download
          className="w-full sm:w-auto"
        >
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 w-full"
          >
            <Download size={16} />
            <span>Download Excel</span>
          </Button>
        </a>
      </div>
    </div>
  );
}
