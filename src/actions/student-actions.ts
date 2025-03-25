"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ExcelJS from "exceljs";

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
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });
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
    return {
      success: false,
      message: "Failed to delete student. Please try again.",
    };
  }
}

export async function bulkAddStudents(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file uploaded");

  const workbook = new ExcelJS.Workbook();
  const buffer = await file.arrayBuffer();
  await workbook.xlsx.load(buffer);

  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) throw new Error("No worksheet found in the Excel file");

  // Get headers from the first row
  const headings = worksheet.getRow(1).values as string[];
  const nameIndex = headings.findIndex(
    (h) => h && h.toLowerCase().trim() === "name"
  );
  const emailIndex = headings.findIndex(
    (h) => h && h.toLowerCase().trim() === "email"
  );
  const branchIndex = headings.findIndex(
    (h) => h && h.toLowerCase().trim() === "branch"
  );
  const phoneIndex = headings.findIndex(
    (h) => h && h.toLowerCase().trim() === "phone"
  );
  const rollnoIndex = headings.findIndex(
    (h) => h && h.toLowerCase().trim() === "roll no"
  );

  if (
    nameIndex === -1 ||
    emailIndex === -1 ||
    branchIndex === -1 ||
    phoneIndex === -1 ||
    rollnoIndex === -1
  ) {
    throw new Error(
      "Missing required columns: Name, Email, Branch, Phone, Roll No"
    );
  }

  // Helper function to ensure a trimmed, non-empty string
  function getTrimmedString(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    fieldName: string,
    rowIndex: number
  ): string {
    if (value === null || value === undefined) {
      throw new Error(`Missing ${fieldName} in row ${rowIndex}`);
    }

    // Handle different types of cell values
    let rawValue: string;
    if (typeof value === "object" && value !== null) {
      // Handle ExcelJS cell value objects
      if ("text" in value) {
        rawValue = String(value.text);
      } else if ("richText" in value) {
        // If it's a rich text cell, extract the first text segment
        rawValue = String(value.richText[0]?.text || "");
      } else if ("result" in value) {
        // Handle formula cell values
        rawValue = String(value.result);
      } else {
        // Convert to string as a fallback
        rawValue = String(value);
      }
    } else {
      // Convert to string for primitive types
      rawValue = String(value);
    }

    // Trim and check for empty string
    const str = rawValue.trim();
    if (str === "") {
      throw new Error(`Empty ${fieldName} in row ${rowIndex}`);
    }
    return str;
  }

  const students = [];
  const emailsSet = new Set<string>();

  // Process each row and collect valid students
  for (let i = 2; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);
    // Skip empty rows or rows without data
    if (row.cellCount === 0) continue;

    const emailCell = row.getCell(emailIndex);
    if (!emailCell || !emailCell.value) continue;

    try {
      const name = getTrimmedString(row.getCell(nameIndex).value, "name", i);
      const email = getTrimmedString(emailCell.value, "email", i).toLowerCase();
      const branch = getTrimmedString(
        row.getCell(branchIndex).value,
        "branch",
        i
      );
      const phone = getTrimmedString(row.getCell(phoneIndex).value, "phone", i);
      const rollno = getTrimmedString(
        row.getCell(rollnoIndex).value,
        "roll no",
        i
      );

      // Check for duplicates within the current file as we process it
      if (emailsSet.has(email)) {
        throw new Error(`Duplicate email found in row ${i}: ${email}`);
      }

      emailsSet.add(email);
      students.push({ name, email, branch, phone, rollno });
    } catch (error) {
      console.error(`Error processing row ${i}:`, error);
      throw error; // Re-throw to stop processing
    }
  }

  // If we made it here, there are no duplicates within the file
  if (students.length === 0) {
    return {
      success: false,
      message: "No valid student data found in the file",
    };
  }

  // Check for existing students in the database
  const emails = Array.from(emailsSet);
  try {
    const existingStudents = await prisma.student.findMany({
      where: { email: { in: emails } },
      select: { email: true },
    });

    if (existingStudents.length > 0) {
      throw new Error(
        `Some emails already exist in the database: ${existingStudents
          .map((s) => s.email)
          .join(", ")}`
      );
    }

    // Insert students into the database
    await prisma.student.createMany({
      data: students,
    });

    return {
      success: true,
      message: `${students.length} students added successfully`,
    };
  } catch (error) {
    console.error("Error during student import:", error);

    // More descriptive error message
    if (error instanceof Error) {
      return {
        success: false,
        message: `Failed to import students: ${error.message}`,
      };
    }

    return {
      success: false,
      message: "An unknown error occurred while importing students",
    };
  }
}
