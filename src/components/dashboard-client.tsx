"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface DashboardProps {
  initialData: {
    studentCount: number;
    courseCount: number;
    upcomingSessions: { id: string; date: Date }[];
  };
}

export function DashboardClient({ initialData }: DashboardProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stats, setStats] = useState(initialData);

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
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome to CyberShield</h1>
        <p className="text-muted-foreground">
          Manage your attendance tracking system efficiently
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-3"
      >
        <motion.div variants={item}>
          <Card className="overflow-hidden border-t-4 border-t-blue-500 dark:border-t-blue-400 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Users className="mr-2 h-5 w-5 text-blue-500 dark:text-blue-400" />
                Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {stats.studentCount}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Total enrolled students
              </p>
              <Link href="/admin/students">
                <Button variant="outline" size="sm" className="w-full group">
                  Manage Students
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="overflow-hidden border-t-4 border-t-purple-500 dark:border-t-purple-400 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <BookOpen className="mr-2 h-5 w-5 text-purple-500 dark:text-purple-400" />
                Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{stats.courseCount}</div>
              <p className="text-sm text-muted-foreground mb-4">
                Active courses
              </p>
              <Link href="/admin/courses">
                <Button variant="outline" size="sm" className="w-full group">
                  Manage Courses
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="overflow-hidden border-t-4 border-t-amber-500 dark:border-t-amber-400 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="mr-2 h-5 w-5 text-amber-500 dark:text-amber-400" />
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {stats.upcomingSessions.length}
              </div>
              <div className="space-y-2 max-h-32 overflow-auto">
                {stats.upcomingSessions.map((session) => (
                  <div key={session.id} className="text-sm flex items-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 mr-2"></div>
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 mt-8"
      >
        <motion.div variants={item}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Link href="/admin/students?view=manage">
                <Button
                  className="w-full justify-start group"
                  variant="outline"
                >
                  <Users className="mr-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
                  Add New Student
                  <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/admin/courses?view=add">
                <Button
                  className="w-full justify-start group"
                  variant="outline"
                >
                  <BookOpen className="mr-2 h-4 w-4 text-purple-500 dark:text-purple-400" />
                  Create New Course
                  <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/admin/students?view=reports">
                <Button
                  className="w-full justify-start group"
                  variant="outline"
                >
                  <Calendar className="mr-2 h-4 w-4 text-amber-500 dark:text-amber-400" />
                  View Attendance Reports
                  <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">
                      Student Enrollment
                    </div>
                    <div className="text-sm text-muted-foreground">75%</div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">
                      Average Attendance
                    </div>
                    <div className="text-sm text-muted-foreground">82%</div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-purple-500 dark:bg-purple-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: "82%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">Course Completion</div>
                    <div className="text-sm text-muted-foreground">40%</div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-amber-500 dark:bg-amber-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: "40%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
