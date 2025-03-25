"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CourseForm } from "@/components/course-form";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BookOpen, Calendar, Users, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Define the Course type
interface Course {
  id: string;
  name: string;
  description: string | null;
}

interface CoursesClientProps {
  initialCourses: Course[];
  initialView: string;
}

export function CoursesClient({
  initialCourses,
  initialView,
}: CoursesClientProps) {
  const [view, setView] = useState(initialView);
  const [courses, setCourses] = useState(initialCourses);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  // Fetch courses when the component mounts or when the view changes
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Add timestamp to prevent caching
        const timestamp = Date.now();
        const response = await fetch(`/api/admin/courses?t=${timestamp}`);
        if (!response.ok) throw new Error("Failed to fetch courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch when in "manage" view
    if (view === "manage") {
      fetchCourses();
    }
  }, [view]);

  const handleTabChange = (value: string) => {
    setView(value);

    // Update URL without using router.push
    const url = new URL(window.location.href);
    url.searchParams.set("view", value);
    url.searchParams.set("t", Date.now().toString());
    window.history.pushState({}, "", url.toString());
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="space-y-6">
      <Tabs value={view} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-6 w-full max-w-md">
          <TabsTrigger value="add" className="flex-1">
            Add Course
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex-1">
            Manage Courses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-4">
          <CourseForm />
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading courses...</p>
              </div>
            </div>
          ) : courses.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8">
                <div className="text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No courses found
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Get started by creating your first course.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => handleTabChange("add")}
                  >
                    Add Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {courses.map((course) => (
                <motion.div key={course.id} variants={item}>
                  <Card className="overflow-hidden hover:shadow-md transition-shadow border-t-4 border-t-primary">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="mr-2 h-5 w-5 text-primary" />
                        {course.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.description || "No description provided"}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          <span>Students</span>
                        </div>
                        <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          <span>Sessions</span>
                        </div>
                      </div>
                      <Link
                        href={`/admin/courses/${course.id}?t=${Date.now()}`}
                      >
                        <Button className="w-full group">
                          Manage Course
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
