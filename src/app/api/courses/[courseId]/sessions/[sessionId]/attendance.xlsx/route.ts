import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ExcelJS from "exceljs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ courseId: string; sessionId: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { sessionId } = await params;

  const attendances = await prisma.courseAttendance.findMany({
    where: { courseSessionId: sessionId },
    include: { student: true },
  });

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Attendance");
  ws.columns = [
    { header: "Student Name", key: "studentName" },
    { header: "Roll No", key: "rollNo" },
    { header: "Present", key: "present" },
  ];

  attendances.forEach((att) => {
    ws.addRow({
      studentName: att.student.name,
      rollNo: att.student.rollno,
      present: att.present ? "Yes" : "No",
    });
  });

  const buffer = await wb.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/x-excel",
      "Content-Disposition": `attachment; filename="attendance-${sessionId}.xlsx"`,
    },
  });
}
