import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Define interface for aggregation result
interface AttendanceStat {
  studentId: string;
  _sum: {
    present: number;
  };
}

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true, name: true, description: true },
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const sessions = await prisma.courseSession.findMany({
    where: { courseId: params.courseId },
    select: { id: true, date: true },
  });

  const enrollments = await prisma.courseEnrollment.findMany({
    where: { courseId: params.courseId },
    include: { student: { select: { id: true, name: true } } },
  });

  // Use findMany to get all attendance records
  const attendanceRecords = await prisma.courseAttendance.findMany({
    where: {
      courseSession: { courseId: params.courseId },
      studentId: { not: "" },
    },
    select: {
      studentId: true,
      present: true,
    },
  });

  // Manually aggregate the data with TypeScript
  const attendanceMap = new Map<string, number>();

  for (const record of attendanceRecords) {
    const currentSum = attendanceMap.get(record.studentId) || 0;
    // Convert boolean to number (1 for true, 0 for false)
    const presentValue = record.present === true ? 1 : 0;
    attendanceMap.set(record.studentId, currentSum + presentValue);
  }

  // Transform to our expected format
  const attendanceStats: AttendanceStat[] = Array.from(
    attendanceMap.entries()
  ).map(([studentId, sum]) => ({
    studentId,
    _sum: { present: sum },
  }));

  const students = await prisma.student.findMany({
    where: { id: { in: Array.from(attendanceMap.keys()) } },
    select: { id: true, name: true },
  });

  const totalSessions = sessions.length;
  const formattedStats = attendanceStats.map((stat) => {
    const student = students.find((s) => s.id === stat.studentId);
    return {
      studentId: stat.studentId,
      studentName: student?.name || "Unknown",
      attendedSessions: stat._sum.present || 0,
      totalSessions,
      percentage: totalSessions
        ? Math.round((stat._sum.present / totalSessions) * 100)
        : 0,
    };
  });

  return NextResponse.json({
    course,
    sessions,
    enrollments,
    attendanceStats: formattedStats,
  });
}
