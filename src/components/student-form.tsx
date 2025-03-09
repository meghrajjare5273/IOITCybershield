"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addStudent } from "@/actions/student-actions";
import { useRouter } from "next/navigation";

export function StudentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setMessage(null);
    const result = await addStudent(formData);
    setIsSubmitting(false);
    setMessage(result.message);
    if (result.success) {
      router.refresh();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Student</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="branch">Branch</Label>
                <Input id="branch" name="branch" required />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" required />
              </div>
            </div>
            <div>
              <Label htmlFor="rollno">Roll No</Label>
              <Input id="rollno" name="rollno" required />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? "Adding..." : "Add Student"}
            </Button>
            {message && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
