"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function addStudent(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const branch = formData.get("branch") as string;
  const phone = formData.get("phone") as string;
  const rollno = formData.get("rollno") as string;

  try {
    await prisma.student.create({
      data: { name, email, branch, phone, rollno },
    });
    return { success: true, message: "Student added successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add student" };
  }
}

export async function deleteStudent(studentId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  try {
    // Check if student exists
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      return { success: false, message: "Student not found" };
    }

    // Delete related records first due to foreign key constraints
    await prisma.courseEnrollment.deleteMany({ where: { studentId } });
    await prisma.courseAttendance.deleteMany({ where: { studentId } });

    // Now delete the student
    await prisma.student.delete({ where: { id: studentId } });
    return { success: true, message: "Student deleted successfully" };
  } catch (error) {
    console.error("Delete student error:", error);
    return { success: false, message: "Failed to delete student. Please try again." };
  }
}
