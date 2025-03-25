import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const students = await prisma.student.findMany({
    where: { name: { contains: search, mode: "insensitive" } },
    select: { id: true, name: true, email: true, branch: true, rollno: true }, // Only fetch needed fields
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.student.count({
    where: { name: { contains: search, mode: "insensitive" } },
  });
  return Response.json({
    students,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  });
}
