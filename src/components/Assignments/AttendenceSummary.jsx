import { AUTH_BASE_URL } from '@/environment';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AttendenceSummary = () => {
  const token = localStorage.getItem("accessToken");
  const [allStudent, setAllstudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { batchId } = useParams();

  const getSummaryData = async () => {
    try {
      const response = await axios.get(`${AUTH_BASE_URL}/attendance/batch-summary/?batch=${batchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllstudents(response.data.students);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSummaryData();
  }, [batchId]);

  return (
    <div className="p-6 mt-4 max-w-5xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Batch Performance</h1>
        <p className="text-muted-foreground italic">Batch ID: {batchId}</p>
      </div>

      <Card className="shadow-md border-none bg-slate-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Student Attendance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border bg-white overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-100/50">
                <TableRow>
                  <TableHead className="w-[300px]">Student Name</TableHead>
                  <TableHead>Visual Progress</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-10">Loading results...</TableCell></TableRow>
                ) : allStudent.length > 0 ? (
                  allStudent.map((student) => {
                    const percentage = parseFloat(student.attendance_percentage);
                    const isAtRisk = percentage < 75;

                    return (
                      <TableRow key={student.id} className="hover:bg-slate-50 transition-colors group">
                        <TableCell className="py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-700 capitalize">
                              {student.student_name}
                            </span>
                            
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-3 w-full max-w-xs">
                            <Progress 
                              value={percentage} 
                              className={`h-2 transition-all ${isAtRisk ? "[&>div]:bg-red-500" : "[&>div]:bg-emerald-500"}`} 
                            />
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <Badge 
                            variant={isAtRisk ? "destructive" : "outline"}
                            className={!isAtRisk ? "border-emerald-200 text-emerald-700 bg-emerald-50" : ""}
                          >
                            {percentage}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                      No student records found for this batch.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AttendenceSummary;