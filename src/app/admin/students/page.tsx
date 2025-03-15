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
import { BulkStudentUpload } from "@/components/bulk-upload";

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
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [coursesFetched, setCoursesFetched] = useState(false);

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

  // Fetch courses for the selected student when in "reports" view
  useEffect(() => {
    if (view === "reports" && selectedStudent) {
      const fetchCourses = async () => {
        try {
          setCoursesFetched(false);
          const response = await fetch(
            `/api/admin/students/${selectedStudent}/courses`
          );
          if (!response.ok) throw new Error("Failed to fetch courses");
          const data = await response.json();
          setCourses(data);
          setCoursesFetched(true);
          // Optionally pre-select the first course
          // if (data.length > 0) setSelectedCourseId(data[0].id);
        } catch (error) {
          console.error("Error fetching courses:", error);
          setCourses([]);
          setCoursesFetched(true);
        }
      };
      fetchCourses();
    }
  }, [selectedStudent, view]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", value);
    if (value !== "reports") {
      params.delete("studentId");
      setSelectedStudent(null);
      setCourses([]);
      setSelectedCourseId(null);
      setCoursesFetched(false);
    }
    router.push(`/admin/students?${params.toString()}`);
  };

  const handleSearch = (query: string) => {
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
    // setSelectedStudent(studentId);
    // const params = new URLSearchParams(searchParams.toString());
    // params.set("view", "reports");
    // params.set("studentId", studentId);
    // router.push(`/admin/students?${params.toString()}`);
    router.push(`/admin/students?view=reports&studentId=${studentId}`);
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
          <TabsContent key="manage" value="manage" asChild>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <StudentForm />
                <BulkStudentUpload />
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

          <TabsContent key="search" value="search" asChild>
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

          <TabsContent key="reports" value="reports" asChild>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {selectedStudent ? (
                !coursesFetched ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    </CardContent>
                  </Card>
                ) : courses.length === 0 ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-8">
                        <h3 className="text-lg font-medium mb-2">
                          No Courses Enrolled
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          This student is not enrolled in any courses.
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
                ) : (
                  <div>
                    <div className="mb-4">
                      <label
                        htmlFor="course-select"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Select Course
                      </label>
                      <select
                        id="course-select"
                        value={selectedCourseId || ""}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">-- Select a course --</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {selectedCourseId && (
                      <StudentAttendanceReport
                        studentId={selectedStudent}
                        courseId={selectedCourseId}
                      />
                    )}
                  </div>
                )
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
