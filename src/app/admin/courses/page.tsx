import { prisma } from "@/lib/prisma";
import { CoursesClient } from "@/components/courses-client";

// Define the type for searchParams
interface SearchParams {
  view: string;
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { view } = await searchParams;
  
  // const view = view || "add";
  const courses = await prisma.course.findMany({
    take: 10, // Initial limit
    select: { id: true, name: true, description: true },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Course Management</h1>
      <CoursesClient initialCourses={courses} initialView={view || "add"} />
    </div>
  );
}
