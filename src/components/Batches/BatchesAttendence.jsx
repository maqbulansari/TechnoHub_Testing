import { AUTH_BASE_URL } from '@/environment';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Users } from 'lucide-react'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';

const AttendenceSummary = () => {
  const token = localStorage.getItem("accessToken");
  const [allStudent, setAllstudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [batchName,setBatchName]=useState("")
  const { batchId } = useParams();

  const getSummaryData = async () => {
    try {
      const response = await axios.get(`${AUTH_BASE_URL}/attendance/batch-summary/?batch=${batchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllstudents(response.data.students);
      setBatchName(response.data.batch_name)
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSummaryData();
  }, [batchId]);

  const chartData = allStudent.map((student) => ({
    name: student.student_name,
    percentage: parseFloat(student.attendance_percentage),
  }));

  return (
    <div className="p-6 mt-4 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{batchName}</h1>
        
        <p className="text-muted-foreground italic">Batch ID: {batchId}</p>
      </div>

      <Card className="border-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500">
        <CardHeader>
          <div className="flex flex-wrap items-start sm:items-center justify-between gap-2">
            <div className="space-y-1">
              <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">Student Attendance Breakdown</CardTitle>
              <CardDescription className="text-primary font-medium flex items-center text-xs sm:text-sm">
                <Users className="w-3 h-3 mr-1" />
                Individual student attendance percentage
              </CardDescription>
            </div>
           
            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
              {allStudent.length} Students
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="h-[350px] sm:h-[400px] lg:h-[500px] w-full mt-4">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground animate-pulse">
                Loading results...
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={chartData} 
                  margin={{ top: 25, right: 30, left: 0, bottom: 60 }}
                >
                  {/* 1. Added the custom blue gradient back in */}
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false} 
                    stroke="#e2e8f0" 
                    opacity={0.4} 
                  />
                  
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fontWeight: 500, fill: 'currentColor' }}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={80}
                    axisLine={false}
                    tickLine={false}
                    className="text-muted-foreground sm:text-xs"
                  />
                  
                  <YAxis 
                    domain={[0, 100]}
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11 }}
                    tickFormatter={(tick) => `${tick}%`}
                    className="text-muted-foreground sm:text-xs" 
                  />
                  
                  <Tooltip 
                    cursor={{ fill: 'rgba(59, 130, 246, 0.05)', radius: 4 }}
                    formatter={(value) => [`${value}%`, 'Attendance']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  
                  <Bar 
                    dataKey="percentage" 
                    fill="url(#blueGradient)" /* 2. Pointed the Bar fill to the gradient */
                    radius={[6, 6, 0, 0]}
                    barSize={30}
                    animationBegin={200}
                    animationDuration={1200}
                    className="sm:bar-size-[40px]"
                  >
                    <LabelList 
                      dataKey="percentage" 
                      position="top" 
                      offset={10} 
                      formatter={(value) => `${value}%`}
                      className="fill-foreground font-bold text-[10px] sm:text-xs" 
                    />
                    
                    {/* 3. Removed the red/green fill logic, just keeping the nice hover effect */}
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                No student records found for this batch.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AttendenceSummary;