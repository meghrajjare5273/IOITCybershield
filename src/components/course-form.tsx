"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { addCourse } from "@/actions/course-actions";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

export function CourseForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setResult(null);
    const res = await addCourse(formData);
    setIsSubmitting(false);
    setResult(res);

    if (res.success) {
      // Reset form
      const form = document.getElementById("course-form") as HTMLFormElement;
      if (form) form.reset();

      // Force a full page reload instead of using router.refresh()
      setTimeout(() => {
        window.location.href =
          window.location.pathname + "?view=manage&t=" + Date.now();
      }, 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white dark:from-blue-950 dark:to-gray-900 rounded-t-xl">
          <CardTitle className="text-primary">Add New Course</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form id="course-form" action={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  className="border-input"
                  placeholder="e.g., Introduction to Cybersecurity"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  required
                  className="border-input"
                  placeholder="Brief description of the course"
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                {result && (
                  <p
                    className={cn(
                      "text-sm flex items-center",
                      result.success ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {result.success ? (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <AlertCircle className="mr-2 h-4 w-4" />
                    )}
                    {result.message}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting || (result?.success ?? false)}
                  className={cn(
                    "bg-primary hover:bg-primary/90",
                    !result && "w-full",
                    result && "ml-auto"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : result?.success ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Added Successfully
                    </>
                  ) : (
                    "Add Course"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
