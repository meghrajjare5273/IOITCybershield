import { prisma } from "@/lib/prisma";
import { SessionForm } from "@/components/session-form";
import { EnrollmentForm } from "@/components/enrollment-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>; // Type params as a Promise
}) {
  const { courseId } = await params; // Await params to get the object
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { sessions: true, enrollments: { include: { student: true } } },
  });

  const allStudents = await prisma.student.findMany({
    select: { id: true, name: true },
  });

  if (!course) return <div>Course not found</div>;

  const unenrolledStudents = allStudents.filter(
    (student) => !course.enrollments.some((e) => e.studentId === student.id)
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{course.name}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <SessionForm courseId={course.id} />
          <ul className="space-y-2 mt-4">
            {course.sessions.map((session) => (
              <li key={session.id}>
                <Link
                  href={`/admin/courses/${course.id}/sessions/${session.id}/attendance`}
                  className="hover:underline"
                >
                  {session.date.toDateString()}
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent>
          <EnrollmentForm courseId={course.id} students={unenrolledStudents} />
          <ul className="space-y-2 mt-4">
            {course.enrollments.map((enrollment) => (
              <li key={enrollment.id}>{enrollment.student.name}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}