"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { bulkAddStudents } from "@/actions/student-actions";
import { FileUp, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export function BulkStudentUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = async (formData: FormData) => {
    setIsUploading(true);
    setMessage(null);
    setSuccess(false);

    try {
      const result = await bulkAddStudents(formData);
      setMessage(result.message);
      setSuccess(result.success);

      if (result.success) {
        // Reset form
        const form = document.getElementById(
          "bulk-upload-form"
        ) as HTMLFormElement;
        if (form) form.reset();
        setFileName(null);

        // Force a full page reload instead of using router.refresh()
        setTimeout(() => {
          window.location.href =
            window.location.pathname + "?view=manage&t=" + Date.now();
        }, 1500);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName(null);
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-gradient-to-r from-green-50 to-white dark:from-green-950 dark:to-gray-900 rounded-t-xl">
        <CardTitle>Bulk Upload Students</CardTitle>
        <CardDescription>
          Upload multiple students at once using Excel
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-md text-sm">
          <p className="font-medium text-blue-800 dark:text-blue-300 mb-2">
            File Requirements:
          </p>
          <ul className="list-disc list-inside text-blue-700 dark:text-blue-400 space-y-1">
            <li>
              Excel file (.xlsx, .xls) with columns: Name, Email, Branch, Phone,
              Roll No
            </li>
            <li>First row should contain headers</li>
            <li>Data should start from the second row</li>
            <li>Email addresses must be unique</li>
          </ul>
        </div>

        <form id="bulk-upload-form" action={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors">
            <FileUp className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex flex-col items-center">
              <label
                htmlFor="file-upload"
                className="cursor-pointer rounded-md bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
              >
                <span>Select Excel File</span>
                <Input
                  id="file-upload"
                  name="file"
                  type="file"
                  accept=".xlsx, .xls"
                  required
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {fileName ? fileName : "No file selected"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {message && (
              <div
                className={`flex items-center text-sm ${
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
            <Button
              type="submit"
              disabled={isUploading || success || !fileName}
              className="ml-auto"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Uploaded Successfully
                </>
              ) : (
                "Upload Students"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
