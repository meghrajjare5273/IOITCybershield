/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionForm } from "@/components/session-form";
import { EnrollmentForm } from "@/components/enrollment-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Users, BarChart } from "lucide-react";
import Link from "next/link";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [loading, setLoading] = useState(true);

  const [course, setCourse] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("sessions");
  const [availableStudents, setAvailableStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/courses/${courseId}`);
        if (!response.ok) throw new Error("Failed to fetch course data");
        const data = await response.json();
        setCourse(data.course);
        setSessions(data.sessions);
        setEnrollments(data.enrollments);
        setAttendanceStats(data.attendanceStats);
        setAvailableStudents(data.availableStudents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{course.name}</h1>
        <p className="text-muted-foreground">{course.description}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users size={16} />
            <span>Students</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <BarChart size={16} />
            <span>Attendance</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sessions">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <SessionForm courseId={course.id} />
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">
                    Scheduled Sessions
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>
                            {new Date(session.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/admin/courses/${course.id}/sessions/${session.id}/attendance`}
                            >
                              <Button size="sm">Mark Attendance</Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="students">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Students</CardTitle>
              </CardHeader>
              <CardContent>
                <EnrollmentForm
                  courseId={course.id}
                  students={availableStudents}
                />
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">
                    Current Enrollments
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell>{enrollment.student.name}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="attendance">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">
                    Attendance Statistics
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Sessions Attended</TableHead>
                        <TableHead>Attendance Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceStats.map((stat) => (
                        <TableRow key={stat.studentId}>
                          <TableCell>{stat.studentName}</TableCell>
                          <TableCell>
                            {stat.attendedSessions} / {stat.totalSessions}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-muted rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    stat.percentage >= 75
                                      ? "bg-green-500"
                                      : stat.percentage >= 60
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${stat.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">
                                {stat.percentage}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
