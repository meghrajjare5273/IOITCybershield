"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface ActionResult {
  success: boolean;
  message: string;
}

export async function addCourse(formData: FormData): Promise<ActionResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  try {
    await prisma.course.create({ data: { name, description } });
    return { success: true, message: "Course added successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add course" };
  }
}
