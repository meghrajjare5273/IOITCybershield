"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CourseForm } from "@/components/course-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "./ui/button";

// Define the Course type
interface Course {
  id: string;
  name: string;
  description: string | null;
}

interface CoursesClientProps {
  initialCourses: Course[];
  initialView: string;
}

export function CoursesClient({
  initialCourses,
  initialView,
}: CoursesClientProps) {
  const [view, setView] = useState(initialView);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [courses, setCourses] = useState(initialCourses);
  const router = useRouter();

  const handleTabChange = (value: string) => {
    setView(value);
    router.push(`/admin/courses?view=${value}`);
  };

  return (
    <Tabs value={view} onValueChange={handleTabChange} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="add">Add Course</TabsTrigger>
        <TabsTrigger value="manage">Manage Courses</TabsTrigger>
      </TabsList>

      <TabsContent value="add" className="space-y-4">
        <CourseForm />
      </TabsContent>

      <TabsContent value="manage" className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.description}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link href={`/admin/courses/${course.id}`}>
                      <Button size="sm">Manage</Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Add pagination controls here */}
        <div className="flex justify-end mt-4">
          {/* Pagination component will go here */}
        </div>
      </TabsContent>
    </Tabs>
  );
}
