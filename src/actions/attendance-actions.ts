"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function saveCourseAttendance(
  formData: FormData,
  sessionId: string
) {
  // Verify user authentication
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  // Fetch the course session to get the courseId
  const courseSession = await prisma.courseSession.findUnique({
    where: { id: sessionId },
    select: { courseId: true },
  });
  if (!courseSession) throw new Error("Session not found");

  const courseId = courseSession.courseId;

  // Fetch all students enrolled in the course
  const enrollments = await prisma.courseEnrollment.findMany({
    where: { courseId },
    select: { studentId: true },
  });

  // Map enrollments to attendance records, checking formData for presence
  const attendances = enrollments.map((enrollment) => {
    const studentId = enrollment.studentId;
    const present = formData.has(`attendance-${studentId}`);
    return { studentId, present };
  });

  try {
    // Upsert attendance records for all enrolled students
    await Promise.all(
      attendances.map((att) =>
        prisma.courseAttendance.upsert({
          where: {
            studentId_courseSessionId: {
              studentId: att.studentId,
              courseSessionId: sessionId,
            },
          },
          update: { present: att.present },
          create: {
            studentId: att.studentId,
            courseSessionId: sessionId,
            present: att.present,
          },
        })
      )
    );
    return { success: true, message: "Attendance saved successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to save attendance" };
  }
}
