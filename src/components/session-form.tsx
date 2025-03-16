"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addCourseSession } from "@/actions/session-actions";
import { CheckCircle, Loader2, AlertCircle, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function SessionForm({ courseId }: { courseId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setMessage(null);
    setSuccess(false);

    const result = await addCourseSession(formData, courseId);
    setIsSubmitting(false);
    setMessage(result.message);

    if (result.success) {
      setSuccess(true);

      // Reset form
      const form = document.getElementById("session-form") as HTMLFormElement;
      if (form) form.reset();

      // Force a full page reload instead of using router.refresh()
      setTimeout(() => {
        window.location.href = window.location.pathname + "?t=" + Date.now();
      }, 1000);
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-blue-500" />
          Add New Session
        </h3>

        <form id="session-form" action={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full">
              <Label htmlFor="date">Session Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                className="h-10"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || success}
              className="self-end h-10"
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
                "Add Session"
              )}
            </Button>
          </div>
          {message && (
            <div
              className={`flex items-center mt-2 text-sm ${
                success ? "text-green-600" : "text-red-600"
              }`}
            >
              {success ? (
                <CheckCircle className="mr-2 h-4 w-4" />
              ) : (
                <AlertCircle className="mr-2 h-4 w-4" />
              )}
              {message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
