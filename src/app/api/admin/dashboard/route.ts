import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const studentCount = await prisma.student.count();
  const courseCount = await prisma.course.count();
  const upcomingSessions = await prisma.courseSession.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: "asc" },
    take: 5,
    select: { id: true, date: true },
  });

  return NextResponse.json({
    studentCount,
    courseCount,
    upcomingSessions,
  });
}
