import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ studentId: string; courseId: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { studentId } = await params;
  const { courseId } = await params;

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { name: true },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { name: true },
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const sessions = await prisma.courseSession.findMany({
    where: { courseId: courseId },
    select: { id: true, date: true },
  });

  const attendances = await prisma.courseAttendance.findMany({
    where: {
      studentId: studentId,
      courseSessionId: { in: sessions.map((s) => s.id) },
    },
    select: { courseSessionId: true, present: true },
  });

  const attendanceRecords = sessions.map((session) => ({
    sessionId: session.id,
    sessionDate: session.date,
    present:
      attendances.find((att) => att.courseSessionId === session.id)?.present ||
      false,
  }));

  return NextResponse.json({
    studentName: student.name,
    courseName: course.name,
    attendanceRecords,
  });
}
