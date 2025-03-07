import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { saveCourseAttendance } from "@/actions/attendance-actions";
import { redirect } from "next/navigation";

export default async function AttendancePage({
  params,
}: {
  params: Promise<{ courseId: string; sessionId: string }>;
}) {
  const { courseId, sessionId } = await params;
  const session = await prisma.courseSession.findUnique({
    where: { id: sessionId },
    include: {
      course: { include: { enrollments: { include: { student: true } } } },
      attendances: true,
    },
  });

  if (!session) return <div>Session not found</div>;

  const students = session.course.enrollments.map((e) => e.student);
  const attendanceMap = new Map(session.attendances.map((a) => [a.studentId, a.present]));

  const handleSubmit = async (formData: FormData) => {
    "use server";
    const result = await saveCourseAttendance(formData, sessionId);
    if (result.success) redirect(`/admin/courses/${courseId}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Attendance for {session.date.toDateString()}</h1>
      <div className="flex justify-between items-center">
        <form action={handleSubmit}>
          <div className="space-y-4">
            {students.map((student) => (
              <div key={student.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`attendance-${student.id}`}
                  name={`attendance-${student.id}`}
                  defaultChecked={attendanceMap.get(student.id) || false}
                />
                <Label htmlFor={`attendance-${student.id}`}>
                  {student.name} ({student.rollno})
                </Label>
              </div>
            ))}
            <Button type="submit">Save Attendance</Button>
          </div>
        </form>
        <a href={`/api/courses/${courseId}/sessions/${sessionId}/attendance.xlsx`} download>
          <Button variant="outline">Download Excel</Button>
        </a>
      </div>
    </div>
  );
}