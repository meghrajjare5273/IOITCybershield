"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { bulkAddStudents } from "@/actions/student-actions";
import { useRouter } from "next/navigation";

export function BulkStudentUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleUpload = async (formData: FormData) => {
    setIsUploading(true);
    setMessage(null);
    try {
      const result = await bulkAddStudents(formData);
      setMessage(result.message);
      if (result.success) {
        router.refresh(); // Refresh the page to update the student list
      }
    } catch (error) {
      setMessage(
        "Failed to upload students. Please check the file and try again."
      );
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Upload Students</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Upload an Excel file with columns: Name, Email, Branch, Phone, Roll
          No. The first row should be headers, and data should start from the
          second row.
        </p>
        <form action={handleUpload}>
          <div className="space-y-4">
            <Input type="file" name="file" accept=".xlsx, .xls" required />
            <Button
              type="submit"
              disabled={isUploading}
              className="w-full md:w-auto"
            >
              {isUploading ? "Uploading..." : "Upload and Add Students"}
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
