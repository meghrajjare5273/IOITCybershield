"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Save, ArrowLeft } from "lucide-react";
import { saveCourseAttendance } from "@/actions/attendance-actions";

type Student = {
  id: string;
  name: string;
  rollno: string;
  present: boolean;
};

export default function AttendancePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const sessionId = params.sessionId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sessionDate, setSessionDate] = useState("");
  const [courseName, setCourseName] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/admin/courses/${courseId}/sessions/${sessionId}/attendance`
        );
        if (!response.ok) throw new Error("Failed to fetch session data");
        const data = await response.json();
        setCourseName(data.courseName);
        setSessionDate(new Date(data.sessionDate).toLocaleDateString());
        setStudents(data.students);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching session data:", error);
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [courseId, sessionId]);

  const toggleAttendance = (studentId: string) => {
    setStudents(
      students.map((student) =>
        student.id === studentId
          ? { ...student, present: !student.present }
          : student
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const formData = new FormData();
      students.forEach((student) => {
        if (student.present) {
          formData.append(`attendance-${student.id}`, "on");
        }
      });

      const result = await saveCourseAttendance(formData, sessionId);
      if (result.success) {
        setMessage({ type: "success", text: result.message });
        setTimeout(() => router.push(`/admin/courses/${courseId}`), 1500);
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      setMessage({ type: "error", text: "Failed to save attendance" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/admin/courses/${courseId}`)}
          className="flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back to Course</span>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Attendance for {sessionDate}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Course: {courseName}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="border rounded-md overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="py-3 px-2 sm:px-4 text-left">Student</th>
                        <th className="py-3 px-2 sm:px-4 text-left">Roll No</th>
                        <th className="py-3 px-2 sm:px-4 text-center">
                          Present
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <tr
                          key={student.id}
                          className={
                            index % 2 === 0 ? "bg-background" : "bg-muted/20"
                          }
                        >
                          <td className="py-3 px-2 sm:px-4">{student.name}</td>
                          <td className="py-3 px-2 sm:px-4">
                            {student.rollno}
                          </td>
                          <td className="py-3 px-2 sm:px-4 text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                id={`attendance-${student.id}`}
                                checked={student.present}
                                onCheckedChange={() =>
                                  toggleAttendance(student.id)
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    {message && (
                      <p
                        className={`text-sm ${
                          message.type === "success"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {message.text}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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
                    <Button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          <span>Save Attendance</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
