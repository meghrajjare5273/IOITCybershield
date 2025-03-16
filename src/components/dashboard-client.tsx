"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, BookOpen, Calendar } from "lucide-react";

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

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Total Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.studentCount}</div>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.courseCount}</div>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.upcomingSessions.length}
          </div>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  );
}
