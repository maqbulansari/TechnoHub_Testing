import React, { useEffect, useMemo, useState } from 'react'
import { AUTH_BASE_URL } from "@/environment";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input"; // Shadcn input for date
import { Badge } from "@/components/ui/badge";



function SingleStudentAttendence() {
const token = localStorage.getItem("accessToken");
  const [attendenceData, setAttendenceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [attendenceInfo,setAttendenceInfo]=useState({})
  
  
  const [selectedDate, setSelectedDate] = useState(
      new Date().toISOString().split("T")[0],
    );

  
    const getAttendenceData = async () => {
        try {
          const response = await axios.get(`${AUTH_BASE_URL}/attendance/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const res = await axios.get(`${AUTH_BASE_URL}/attendance/my-summary/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(response.data);
          console.log("second",res.data)
          setAttendenceInfo(res.data)
          setAttendenceData(response.data)
        } catch (error) {
          console.error("Error fetching attendance:", error);
        } finally {
      setLoading(false);
    }
      };
    
      
    
      useEffect(() => {
        getAttendenceData();
      }, []);
    
      // Filter data based on the selected date
      
    const filteredData = useMemo(() => {
        return attendenceData.filter((record) => record.date === selectedDate);
      }, [attendenceData, selectedDate]);

  return (
<div className="p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Daily Attendance
          </h2>
          <p className="text-muted-foreground text-sm">
            Viewing records for {selectedDate}
          </p>
        </div>
      {/* Date Selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Select Date:</label>
          <Input
            type="date"
            className="w-[200px]"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[250px]">Student Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Marked By</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <div> data is loading.... </div>
            ) : filteredData.length > 0 ? (
              filteredData.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-semibold capitalize">
                    {student.student_name}
                  </TableCell>
                  <TableCell className="font-semibold capitalize">
                    {student.date}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.status === "P" ? "default" : "destructive"
                      }
                    >
                      {student.status === "P" ? "Present" : "Absent"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {student.marked_by}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No attendance found for {selectedDate}.
                </TableCell>
              </TableRow>
            )}

              <TableRow>
                <TableCell>
                  Attendence:{attendenceInfo.attendance_percentage}%
                </TableCell>
                <TableCell>
                  Total-Days:{attendenceInfo.total_days}
                </TableCell>
                <TableCell>
                  Present-Days:{attendenceInfo.present}
                </TableCell>
                <TableCell>
                  Absent-Days:{attendenceInfo.absent}
                </TableCell>
              </TableRow>

          </TableBody>
        </Table>


      </div>

      
    </div> )
}

export default SingleStudentAttendence