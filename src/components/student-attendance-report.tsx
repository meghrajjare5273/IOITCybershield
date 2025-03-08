"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";

type AttendanceRecord = {
  sessionId: string;
  sessionDate: string;
  present: boolean;
};

type StudentAttendanceProps = {
  studentId: string;
  courseId: string;
};

export function StudentAttendanceReport({
  studentId,
  courseId,
}: StudentAttendanceProps) {
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // In a real implementation, this would be an API call
        // For now, we'll simulate the data
        setLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock data
        setStudentName("John Doe");
        setCourseName("Cybersecurity Fundamentals");
        setAttendanceRecords([
          { sessionId: "1", sessionDate: "2023-09-01", present: true },
          { sessionId: "2", sessionDate: "2023-09-08", present: true },
          { sessionId: "3", sessionDate: "2023-09-15", present: false },
          { sessionId: "4", sessionDate: "2023-09-22", present: true },
          { sessionId: "5", sessionDate: "2023-09-29", present: true },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [studentId, courseId]);

  const attendancePercentage =
    attendanceRecords.length > 0
      ? Math.round(
          (attendanceRecords.filter((r) => r.present).length /
            attendanceRecords.length) *
            100
        )
      : 0;

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return "text-green-500";
    if (percentage >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Attendance Report: {studentName}</CardTitle>
          <p className="text-muted-foreground">Course: {courseName}</p>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Attendance Rate</h3>
              <p className="text-sm text-muted-foreground">
                {attendanceRecords.filter((r) => r.present).length} of{" "}
                {attendanceRecords.length} sessions attended
              </p>
            </div>
            <div className="text-3xl font-bold flex items-center gap-2">
              <span className={getAttendanceColor(attendancePercentage)}>
                {attendancePercentage}%
              </span>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record) => (
                <TableRow key={record.sessionId}>
                  <TableCell>
                    {new Date(record.sessionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {record.present ? (
                      <div className="flex items-center text-green-500">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Present
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <XCircle className="mr-2 h-4 w-4" />
                        Absent
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
