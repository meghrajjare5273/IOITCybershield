import { prisma } from "@/lib/prisma";
import { CourseForm } from "@/components/course-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Courses</h1>
      <CourseForm />
      <Card>
        <CardHeader>
          <CardTitle>Course List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="hover:underline"
                    >
                      {course.name}
                    </Link>
                  </TableCell>
                  <TableCell>{course.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
