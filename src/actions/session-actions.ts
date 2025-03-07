"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function addCourseSession(formData: FormData, courseId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const date = new Date(formData.get("date") as string);

  try {
    await prisma.courseSession.create({ data: { courseId, date } });
    return { success: true, message: "Session added successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add session" };
  }
}
    