"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addCourseSession } from "@/actions/session-actions";
import { useRouter } from "next/navigation";

export function SessionForm({ courseId }: { courseId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setMessage(null)
    const result = await addCourseSession(formData, courseId);
    setIsSubmitting(false);
    setMessage(result.message);
    if (result.success) {
      router.refresh();
    }
  };

  return (
    <form action={handleSubmit}>
      <div className="flex space-x-4">
        <div>
          <Label htmlFor="date">Session Date</Label>
          <Input id="date" name="date" type="date" required />
        </div>
        <Button type="submit" disabled={isSubmitting} className="self-end">
          {isSubmitting ? "Adding..." : "Add Session"}
        </Button>
      </div>
      {message && <p className="text-sm text-muted-foreground mt-2">{message}</p>}
    </form>
  );
}