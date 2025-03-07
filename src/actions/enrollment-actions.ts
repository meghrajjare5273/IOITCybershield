"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function enrollStudent(formData: FormData, courseId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const studentId = formData.get("studentId") as string;

  try {
    await prisma.courseEnrollment.create({
      data: { studentId, courseId },
    });
    return { success: true, message: "Student enrolled successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to enroll student" };
  }
}