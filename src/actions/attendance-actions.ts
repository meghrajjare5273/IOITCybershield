"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function saveCourseAttendance(
  formData: FormData,
  sessionId: string
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const attendances = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("attendance-")) {
      const studentId = key.replace("attendance-", "");
      const present = value === "on";
      attendances.push({ studentId, present });
    }
  }

  try {
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
