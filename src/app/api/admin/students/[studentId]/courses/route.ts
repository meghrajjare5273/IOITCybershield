import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ studentId: string }> }
) {
  // Authenticate the request
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { studentId } = await params;

  // Fetch courses where the student is enrolled
  const courses = await prisma.course.findMany({
    where: {
      enrollments: {
        some: {
          studentId,
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return NextResponse.json(courses);
}
