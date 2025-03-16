import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/dashboard-client";

export default async function AdminPage() {
  const studentCount = await prisma.student.count();
  const courseCount = await prisma.course.count();
  const upcomingSessions = await prisma.courseSession.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: "asc" },
    take: 5, // Limit to reduce load
    select: { id: true, date: true },
  });

  return (
    <DashboardClient
      initialData={{ studentCount, courseCount, upcomingSessions }}
    />
  );
}
