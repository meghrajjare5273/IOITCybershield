"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { addCourse } from "@/actions/course-actions";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function CourseForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setResult(null);
    const res = await addCourse(formData);
    setIsSubmitting(false);
    setResult(res);
    if (res.success) router.refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-primary">Add New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required className="border-input" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" required className="border-input" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                {isSubmitting ? "Adding..." : "Add Course"}
              </Button>
              {result && (
                <p className={cn("text-sm", result.success ? "text-green-500" : "text-red-500")}>
                  {result.message}
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}