import { prisma } from "@/lib/prisma";
import { StudentForm } from "@/components/student-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/delete-button";
import { StudentSearch } from "@/components/student-search";

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const { search } = (await searchParams) || "";
  const students = await prisma.student.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { rollno: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Students</h1>
      <StudentForm />
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
        </CardHeader>
        <CardContent>
          <StudentSearch /> {/* Add search input here */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.branch}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.rollno}</TableCell>
                  <TableCell>
                    <DeleteButton studentId={student.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
