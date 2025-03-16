import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  // Pagination parameters
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  // Calculate skip value for pagination
  const skip = (page - 1) * limit;

  // Query with pagination
  const students = await prisma.student.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { rollno: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      branch: true,
      phone: true,
      rollno: true,
    },
    skip,
    take: limit,
  });

  // Get total count for pagination metadata
  const totalCount = await prisma.student.count({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { rollno: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    },
  });

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limit);

  return NextResponse.json({
    students,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
}
