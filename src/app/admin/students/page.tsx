/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import {
  Plus,
  Search,
  BarChart,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { BulkStudentUpload } from "@/components/bulk-upload";

// Add pagination type
interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function StudentsPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "manage";
  const studentIdParam = searchParams.get("studentId");
  const searchQuery = searchParams.get("search") || "";
  const pageParam = searchParams.get("page") || "1";
  const limitParam = searchParams.get("limit") || "10";

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(
    studentIdParam
  );
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [coursesFetched, setCoursesFetched] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  // Add pagination state
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: Number.parseInt(pageParam, 10),
    limit: Number.parseInt(limitParam, 10),
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Fetch students data with pagination
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add timestamp to prevent caching
        const timestamp = Date.now();
        const response = await fetch(
          `/api/admin/students?search=${encodeURIComponent(searchQuery)}&page=${
            pagination.page
          }&limit=${pagination.limit}&t=${timestamp}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch students: ${response.statusText}`);
        }

        const data = await response.json();
        setStudents(data.students);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load students"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [searchQuery, pagination.page, pagination.limit, searchParams]);

  // Fetch courses for the selected student when in "reports" view
  useEffect(() => {
    if (view === "reports" && selectedStudent) {
      const fetchCourses = async () => {
        try {
          setCoursesLoading(true);
          setCoursesFetched(false);
          setCoursesError(null);

          // Add timestamp to prevent caching
          const timestamp = Date.now();
          const response = await fetch(
            `/api/admin/students/${selectedStudent}/courses?t=${timestamp}`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch courses: ${response.statusText}`);
          }

          const data = await response.json();
          setCourses(data);
          setCoursesFetched(true);

          // Optionally pre-select the first course if available
          if (data.length > 0 && !selectedCourseId) {
            setSelectedCourseId(data[0].id);
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
          setCoursesError(
            error instanceof Error ? error.message : "Failed to load courses"
          );
          setCourses([]);
        } finally {
          setCoursesLoading(false);
          setCoursesFetched(true);
        }
      };

      fetchCourses();
    }
  }, [selectedStudent, view, selectedCourseId]);

  const handleTabChange = (value: string) => {
    // Update URL without causing a full page navigation
    const url = new URL(window.location.href);
    url.searchParams.set("view", value);

    // If changing away from reports, remove studentId
    if (value !== "reports") {
      url.searchParams.delete("studentId");
      setSelectedStudent(null);
      setCourses([]);
      setSelectedCourseId(null);
      setCoursesFetched(false);
    }

    // Add timestamp to force refresh
    url.searchParams.set("t", Date.now().toString());
    window.history.pushState({}, "", url.toString());

    // Force reload to ensure fresh data
    window.location.href = url.toString();
  };

  const handleSearch = (query: string) => {
    // Update URL with search query
    const url = new URL(window.location.href);
    url.searchParams.set("search", query);
    url.searchParams.set("page", "1"); // Reset to first page on new search
    url.searchParams.set("t", Date.now().toString()); // Add timestamp
    window.history.pushState({}, "", url.toString());

    // Force reload to ensure fresh data
    window.location.href = url.toString();
  };

  const handleViewAttendance = (studentId: string) => {
    setSelectedStudent(studentId);

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("view", "reports");
    url.searchParams.set("studentId", studentId);
    url.searchParams.set("t", Date.now().toString()); // Add timestamp
    window.history.pushState({}, "", url.toString());

    // Force reload to ensure fresh data
    window.location.href = url.toString();
  };

  // Add page change handler
  const handlePageChange = (newPage: number) => {
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("page", newPage.toString());
    url.searchParams.set("t", Date.now().toString()); // Add timestamp
    window.history.pushState({}, "", url.toString());

    // Force reload to ensure fresh data
    window.location.href = url.toString();
  };

  // Add limit change handler
  const handleLimitChange = (newLimit: number) => {
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("limit", newLimit.toString());
    url.searchParams.set("page", "1"); // Reset to first page when changing limit
    url.searchParams.set("t", Date.now().toString()); // Add timestamp
    window.history.pushState({}, "", url.toString());

    // Force reload to ensure fresh data
    window.location.href = url.toString();
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
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Student List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <div className="flex flex-col items-center space-y-4">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="text-muted-foreground">
                            Loading students...
                          </p>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="flex justify-center py-8 text-red-600">
                        <div className="flex flex-col items-center space-y-4">
                          <AlertCircle className="h-8 w-8" />
                          <p>{error}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="border rounded-md overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Roll No</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {students.length === 0 ? (
                                <TableRow>
                                  <TableCell
                                    colSpan={3}
                                    className="text-center py-8 text-muted-foreground"
                                  >
                                    No students found
                                  </TableCell>
                                </TableRow>
                              ) : (
                                students.map((student) => (
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
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Add pagination controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-sm text-muted-foreground">
                            Showing {students.length} of {pagination.total}{" "}
                            students
                          </div>
                          <div className="flex items-center space-x-2">
                            <select
                              className="h-9 w-20 rounded-md border border-input bg-background px-3"
                              value={pagination.limit}
                              onChange={(e) =>
                                handleLimitChange(
                                  Number.parseInt(e.target.value)
                                )
                              }
                            >
                              <option value="5">5</option>
                              <option value="10">10</option>
                              <option value="25">25</option>
                              <option value="50">50</option>
                            </select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handlePageChange(pagination.page - 1)
                              }
                              disabled={!pagination.hasPrevPage}
                            >
                              <ChevronLeft size={16} />
                            </Button>
                            <span className="text-sm">
                              Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handlePageChange(pagination.page + 1)
                              }
                              disabled={!pagination.hasNextPage}
                            >
                              <ChevronRight size={16} />
                            </Button>
                          </div>
                        </div>
                      </>
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
                      <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">
                          Searching students...
                        </p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex justify-center py-8 text-red-600">
                      <div className="flex flex-col items-center space-y-4">
                        <AlertCircle className="h-8 w-8" />
                        <p>{error}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="border rounded-md overflow-hidden mt-4">
                        <Table>
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
                            {students.length === 0 ? (
                              <TableRow>
                                <TableCell
                                  colSpan={6}
                                  className="text-center py-8 text-muted-foreground"
                                >
                                  No students found matching your search
                                  criteria
                                </TableCell>
                              </TableRow>
                            ) : (
                              students.map((student) => (
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
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Add pagination controls for search results */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-muted-foreground">
                          Showing {students.length} of {pagination.total}{" "}
                          students
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            className="h-9 w-20 rounded-md border border-input bg-background px-3"
                            value={pagination.limit}
                            onChange={(e) =>
                              handleLimitChange(Number.parseInt(e.target.value))
                            }
                          >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                          </select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handlePageChange(pagination.page - 1)
                            }
                            disabled={!pagination.hasPrevPage}
                          >
                            <ChevronLeft size={16} />
                          </Button>
                          <span className="text-sm">
                            Page {pagination.page} of {pagination.totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handlePageChange(pagination.page + 1)
                            }
                            disabled={!pagination.hasNextPage}
                          >
                            <ChevronRight size={16} />
                          </Button>
                        </div>
                      </div>
                    </>
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
                coursesLoading ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-center py-8">
                        <div className="flex flex-col items-center space-y-4">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="text-muted-foreground">
                            Loading student courses...
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : coursesError ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-center py-8 text-red-600">
                        <div className="flex flex-col items-center space-y-4">
                          <AlertCircle className="h-8 w-8" />
                          <p>{coursesError}</p>
                        </div>
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
                          onClick={() => {
                            const url = new URL(window.location.href);
                            url.searchParams.set("view", "manage");
                            url.searchParams.delete("studentId");
                            url.searchParams.set("t", Date.now().toString());
                            window.location.href = url.toString();
                          }}
                        >
                          Go to Student List
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div>
                    <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      <label
                        htmlFor="course-select"
                        className="block text-sm font-medium mb-2"
                      >
                        Select Course to View Attendance
                      </label>
                      <select
                        id="course-select"
                        value={selectedCourseId || ""}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                        className="w-full py-2 px-3 border border-gray-300 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
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
                        onClick={() => {
                          const url = new URL(window.location.href);
                          url.searchParams.set("view", "manage");
                          url.searchParams.set("t", Date.now().toString());
                          window.location.href = url.toString();
                        }}
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
