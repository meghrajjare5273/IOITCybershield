/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudentForm } from "@/components/student-form";
import { StudentSearch } from "@/components/student-search";
import { StudentAttendanceReport } from "@/components/student-attendance-report";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/delete-button";
import { Button } from "@/components/ui/button";
import { Plus, Search, BarChart } from "lucide-react";

export default function StudentsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const view = searchParams.get("view") || "manage";
  const studentIdParam = searchParams.get("studentId");
  const searchQuery = searchParams.get("search") || "";

  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(
    studentIdParam
  );

  // Fetch students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/admin/students?search=${encodeURIComponent(searchQuery)}`
        );
        if (!response.ok) throw new Error("Failed to fetch students");
        const data = await response.json();
        setStudents(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, [searchQuery]);

  const handleTabChange = (value: string) => {
    // Update URL without causing a full page navigation
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", value);

    // If changing away from reports, remove studentId
    if (value !== "reports") {
      params.delete("studentId");
    }

    router.push(`/admin/students?${params.toString()}`);
  };

  const handleSearch = (query: string) => {
    // Filter students locally without URL change
    if (query) {
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(query.toLowerCase()) ||
          student.email.toLowerCase().includes(query.toLowerCase()) ||
          student.rollno.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  };

  const handleViewAttendance = (studentId: string) => {
    setSelectedStudent(studentId);

    // Update URL without causing a full page navigation
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", "reports");
    params.set("studentId", studentId);
    router.push(`/admin/students?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Students Management</h1>
      </div>

      <Tabs value={view} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Plus size={16} />
            <span>Manage</span>
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search size={16} />
            <span>Search</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart size={16} />
            <span>Reports</span>
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="manage" asChild>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <StudentForm />

                <Card>
                  <CardHeader>
                    <CardTitle>Student List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Roll No</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {students.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>{student.name}</TableCell>
                              <TableCell>{student.rollno}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <DeleteButton studentId={student.id} />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleViewAttendance(student.id)
                                    }
                                  >
                                    View Attendance
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="search" asChild>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Search Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <StudentSearch
                    onSearch={handleSearch}
                    initialValue={searchQuery}
                  />

                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <Table className="mt-4">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Branch</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Roll No</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.branch}</TableCell>
                            <TableCell>{student.phone}</TableCell>
                            <TableCell>{student.rollno}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <DeleteButton studentId={student.id} />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleViewAttendance(student.id)
                                  }
                                >
                                  View Attendance
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="reports" asChild>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {selectedStudent ? (
                <StudentAttendanceReport
                  studentId={selectedStudent}
                  courseId="1"
                />
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium mb-2">
                        No Student Selected
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Please select a student to view their attendance report
                      </p>
                      <Button
                        onClick={() =>
                          router.push("/admin/students?view=manage")
                        }
                      >
                        Go to Student List
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
