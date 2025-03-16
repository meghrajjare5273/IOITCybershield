import { prisma } from "@/lib/prisma";
import { AttendanceClient } from "@/components/attendance-client";
import { notFound } from "next/navigation";

interface PageParams {
  params: {
    courseId: string;
    sessionId: string;
  };
}

export default async function AttendancePage({ params }: PageParams) {
  const { courseId, sessionId } = await   params;

  const session = await prisma.courseSession.findUnique({
    where: { id: sessionId },
    include: { course: { select: { name: true } } },
  });

  if (!session) {
    return notFound();
  }

  const enrollments = await prisma.courseEnrollment.findMany({
    where: { courseId },
    include: { student: { select: { id: true, name: true, rollno: true } } },
  });

  const attendances = await prisma.courseAttendance.findMany({
    where: { courseSessionId: sessionId },
    select: { studentId: true, present: true },
  });

  const students = enrollments.map((e) => ({
    id: e.student.id,
    name: e.student.name,
    rollno: e.student.rollno,
    present:
      attendances.find((a) => a.studentId === e.student.id)?.present || false,
  }));

  return (
    <AttendanceClient
      session={{ date: session.date, courseName: session.course.name }}
      students={students}
      sessionId={sessionId}
      courseId={courseId}
    />
  );
}
