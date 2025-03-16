"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addStudent } from "@/actions/student-actions";
import { CheckCircle, Loader2 } from "lucide-react";

export function StudentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setMessage(null);
    setSuccess(false);

    const result = await addStudent(formData);
    setIsSubmitting(false);
    setMessage(result.message);

    if (result.success) {
      setSuccess(true);
      // Reset form
      const form = document.getElementById("student-form") as HTMLFormElement;
      if (form) form.reset();

      // Force a full page reload instead of using router.refresh()
      setTimeout(() => {
        window.location.href =
          window.location.pathname + "?view=manage&t=" + Date.now();
      }, 1000);
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-950 dark:to-gray-900 rounded-t-xl">
        <CardTitle>Add New Student</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form id="student-form" action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required placeholder="John Doe" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="branch">Branch/Department</Label>
              <Input
                id="branch"
                name="branch"
                required
                placeholder="Computer Science"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                required
                placeholder="1234567890"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="rollno">Roll Number</Label>
            <Input id="rollno" name="rollno" required placeholder="CS001" />
          </div>
          <div className="flex items-center justify-between pt-2">
            {message && (
              <p
                className={`text-sm ${
                  success ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || success}
              className="ml-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Added Successfully
                </>
              ) : (
                "Add Student"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
