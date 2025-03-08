import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { courseId: string; sessionId: string } }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courseSession = await prisma.courseSession.findUnique({
    where: { id: params.sessionId },
    include: { course: { select: { name: true } } },
  });

  if (!courseSession) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const enrollments = await prisma.courseEnrollment.findMany({
    where: { courseId: params.courseId },
    include: { student: { select: { id: true, name: true, rollno: true } } },
  });

  const attendances = await prisma.courseAttendance.findMany({
    where: { courseSessionId: params.sessionId },
    select: { studentId: true, present: true },
  });

  const students = enrollments.map((enrollment) => ({
    id: enrollment.student.id,
    name: enrollment.student.name,
    rollno: enrollment.student.rollno,
    present: attendances.find((att) => att.studentId === enrollment.student.id)?.present || false,
  }));

  return NextResponse.json({
    courseName: courseSession.course.name,
    sessionDate: courseSession.date,
    students,
  });
}