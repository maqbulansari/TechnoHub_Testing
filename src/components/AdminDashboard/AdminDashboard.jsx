import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  GraduationCap,
  Heart,
  Briefcase,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  BookOpen,
  UserCheck,
  AlertCircle,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  LabelList,
  Pie,
  Cell,
} from 'recharts';
import { AuthContext } from '@/contexts/authContext';
import Loading from '@/Loading';



const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const { API_BASE_URL } = useContext(AuthContext);

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(`${API_BASE_URL}/admin-dashboard/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDashboardData(response.data);
      console.log(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Export Functions
  const exportToCSV = () => {
    if (!dashboardData) return;

    setExporting(true);

    try {
      const csvData = [];

      // Summary
      csvData.push(['=== SUMMARY ===']);
      csvData.push(['Metric', 'Value']);
      Object.entries(dashboardData.summary).forEach(([key, value]) => {
        csvData.push([key.replace(/_/g, ' ').toUpperCase(), value]);
      });

      csvData.push([]);
      csvData.push(['=== BATCH STRENGTH ===']);
      csvData.push(['Batch Name', 'Students']);
      Object.entries(dashboardData.batch_strength).forEach(([key, value]) => {
        csvData.push([key, value]);
      });

      csvData.push([]);
      csvData.push(['=== TECHNOLOGY DISTRIBUTION ===']);
      csvData.push(['Technology', 'Students']);
      Object.entries(dashboardData.technology_student_count).forEach(([key, value]) => {
        csvData.push([key, value]);
      });

      csvData.push([]);
      csvData.push(['=== SPONSORSHIP SUMMARY ===']);
      Object.entries(dashboardData.sponsorship_summary).forEach(([key, value]) => {
        csvData.push([key.replace(/_/g, ' ').toUpperCase(), value]);
      });

      csvData.push([]);
      csvData.push(['=== RECRUITMENT SUMMARY ===']);
      Object.entries(dashboardData.recruitment_summary).forEach(([key, value]) => {
        csvData.push([key.replace(/_/g, ' ').toUpperCase(), value]);
      });

      csvData.push([]);
      csvData.push(['=== ASSESSMENT SUMMARY ===']);
      Object.entries(dashboardData.assessment_summary).forEach(([key, value]) => {
        csvData.push([key.replace(/_/g, ' ').toUpperCase(), value]);
      });

      csvData.push([]);
      csvData.push(['=== ADMISSION SUMMARY ===']);
      Object.entries(dashboardData.admission_summary).forEach(([key, value]) => {
        csvData.push([key.replace(/_/g, ' ').toUpperCase(), value]);
      });

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `dashboard_report_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  const exportToJSON = () => {
    if (!dashboardData) return;

    setExporting(true);

    try {
      const jsonContent = JSON.stringify(dashboardData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `dashboard_report_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Loading State
  if (loading) {
    return (
      <Loading />)
  }
// 1. Define the custom tick outside or inside your main component


// ... inside your chart rendering ...



  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Error Loading Dashboard</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={fetchDashboardData} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboardData) return null;

  // Chart Data Transformations
  const batchStrengthData = Object.entries(dashboardData.batch_strength).map(
    ([name, value]) => ({
      name: name,
      fullName: name,
      students: value,
    })
  );

  const technologyData = Object.entries(dashboardData.technology_student_count).map(
    ([name, value]) => ({
      name,
      students: value,
    })
  );

  const genderStudentData = [
    { name: 'Male', value: dashboardData.gender_distribution.students.count.male },
    { name: 'Female', value: dashboardData.gender_distribution.students.count.female },
  ];

  const assessmentData = [
    { name: 'Admin Selected', value: dashboardData.assessment_summary.admin_selected },
    { name: 'Admin Rejected', value: dashboardData.assessment_summary.admin_rejected },
    { name: 'Pending Review', value: dashboardData.assessment_summary.pending_admin_review },
  ];

  // Summary Card Component
  const SummaryCard = ({ title, value, icon: Icon, trend }) => (
    <Card className="transition-all duration-300 border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{value}</p>
            {trend && (
              <div className="flex items-center text-sm text-primary">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>{trend}</span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-xl bg-primary/10 grid place-items-center">
            <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>

        </div>
      </CardContent>
    </Card>
  );

  // Stat Item Component
  const StatItem = ({ icon: Icon, label, value, variant = 'default' }) => {
    const variantClasses = {
      default: 'text-primary',
      success: 'text-primary',
      danger: 'text-destructive',
      warning: 'text-secondary',
    };

    return (
      <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
        <div className="flex items-center gap-3">
          <div className="p-2 w-8 h-8 flex items-center justify-center rounded-lg bg-muted">
            <Icon className={`w-4 h-4 ${variantClasses[variant]}`} />
          </div>

          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <span className="font-semibold text-foreground">{value}</span>
      </div>
    );
  };

  // Custom Tooltip for Charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground p-3 rounded-lg border border-border shadow-md">
          <p className="font-medium text-sm sm:text-base">{payload[0].payload.fullName || label}</p>
          <p className="text-primary font-semibold text-sm sm:text-base">{payload[0].value} students</p>
        </div>
      );
    }
    return null;
  };


  const CustomYAxisTick = ({ x, y, payload }) => {
    const words = payload.value.split(" ");
    const firstLine = words.slice(0, 2).join(" ");
    const secondLine = words.slice(2).join(" ");

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={-10}
          y={0}
          textAnchor="end"
          fill="currentColor"
          fontSize={10}
          className="sm:text-xs"
        >
          <tspan x={-10} dy="0">
            {firstLine}
          </tspan>
          {secondLine && (
            <tspan x={-10} dy="14">
              {secondLine}
            </tspan>
          )}
        </text>
      </g>
    );
  };

  

  return (
    <div className="min-h-screen mt-7 bg-background p-4 sm:p-6 lg:p-8 print:p-4">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Dashboard Overview
            </h1>
            <p className="text-sm sm:text-base text-primary">
              Welcome back! Here's what's happening with your academy.
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboardData}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="gap-2" disabled={exporting}>
                  {exporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span className="hidden xs:inline">Export All</span>
                  <span className="inline xs:hidden">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={exportToCSV} className="gap-2 cursor-pointer">
                  <FileSpreadsheet className="w-4 h-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToJSON} className="gap-2 cursor-pointer">
                  <FileText className="w-4 h-4" />
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint} className="gap-2 cursor-pointer">
                  <Printer className="w-4 h-4" />
                  Print Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Students"
            value={dashboardData.summary.students}
            icon={GraduationCap}
          />
          <SummaryCard
            title="Total Trainers"
            value={dashboardData.summary.trainers}
            icon={Users}
          />
          <SummaryCard
            title="Active Sponsors"
            value={dashboardData.summary.sponsors}
            icon={Heart}
          />
          <SummaryCard
            title="Recruiters"
            value={dashboardData.summary.recruiters}
            icon={Briefcase}
          />
        </div>

        {/* Recruitment & Sponsorship Summary - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recruitment Summary */}
          <Card className="transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-start sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-lg font-semibold">Recruitment Summary</CardTitle>
                  <CardDescription className="text-primary text-sm sm:text-base" >Hiring and placement overview</CardDescription>
                </div>
                <Badge variant="blue">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="text-center p-4 bg-muted rounded-xl">
                  <p className="text-2xl font-bold text-primary">
                    {dashboardData.recruitment_summary.total_recruitments}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Total Recruitments</p>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-xl">
                  <p className="text-2xl font-bold text-primary">
                    {dashboardData.recruitment_summary.hired_students}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Hired Students</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-xl">
                  <p className="text-2xl font-bold text-secondary-foreground">
                    {dashboardData.recruitment_summary.pending_recruitments}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Pending</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hiring Rate</span>
                  <span className="font-medium text-foreground">
                    {dashboardData.recruitment_summary.total_recruitments > 0
                      ? ((dashboardData.recruitment_summary.hired_students / dashboardData.recruitment_summary.total_recruitments) * 100).toFixed(0)
                      : 0}%
                  </span>
                </div>
                <Progress
                  value={
                    dashboardData.recruitment_summary.total_recruitments > 0
                      ? (dashboardData.recruitment_summary.hired_students / dashboardData.recruitment_summary.total_recruitments) * 100
                      : 0
                  }
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sponsorship Summary */}
          <Card className="transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-start sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-lg font-semibold">Sponsorship Summary</CardTitle>
                  <CardDescription className="text-primary text-sm sm:text-base" >Financial support overview</CardDescription>
                </div>
                <Badge variant="blue">
                  ₹
                  {dashboardData.sponsorship_summary.total_sponsorship_amount.toLocaleString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="text-center p-4 bg-muted rounded-xl">
                  <p className="text-2xl font-bold text-primary">
                    {dashboardData.sponsorship_summary.total_sponsored_students}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Sponsored Students</p>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-xl">
                  <p className="text-2xl font-bold text-primary">
                    {dashboardData.sponsorship_summary.successful_payments}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Successful Payments</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-xl">
                  <p className="text-2xl font-bold text-foreground">
                    ₹{dashboardData.sponsorship_summary.total_sponsored_students > 0
                      ? (dashboardData.sponsorship_summary.total_sponsorship_amount / dashboardData.sponsorship_summary.total_sponsored_students).toFixed(0)
                      : 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Avg. per Student</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Success Rate</span>
                  <span className="font-medium text-foreground">
                    {dashboardData.sponsorship_summary.total_sponsored_students > 0
                      ? ((dashboardData.sponsorship_summary.successful_payments / dashboardData.sponsorship_summary.total_sponsored_students) * 100).toFixed(0)
                      : 0}%
                  </span>
                </div>
                <Progress
                  value={
                    dashboardData.sponsorship_summary.total_sponsored_students > 0
                      ? (dashboardData.sponsorship_summary.successful_payments / dashboardData.sponsorship_summary.total_sponsored_students) * 100
                      : 0
                  }
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Batch Strength & Assessment Summary - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* --- Batch Strength Chart --- */}
  <Card className="border-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-500">
  <CardHeader className="pb-2">
    <div className="flex flex-wrap items-start sm:items-center justify-between gap-2">
      <div className="space-y-1">
        <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">
          Batch Capacity
        </CardTitle>
        <CardDescription className="flex items-center text-primary font-medium text-xs sm:text-sm">
          <TrendingUp className="w-3 h-3 mr-1" />
          Live distribution across {dashboardData.summary.batches} batches
        </CardDescription>
      </div>
      <Badge variant={"blue"}>
        {dashboardData.summary.batches} Active
      </Badge>
    </div>
  </CardHeader>

  <CardContent>
    {/* 1. Adjusted wrapper heights for better scaling across devices */}
    <div className="h-[280px] sm:h-[350px] lg:h-[400px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={batchStrengthData}
          layout="vertical"
          // 2. Increased right margin to prevent label cutoff on mobile
          margin={{ top: 5, right: 45, left: 0, bottom: 5 }} 
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={1} />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            horizontal={false} 
            stroke="#e2e8f0" 
            opacity={0.5} 
          />
          
          <XAxis type="number" hide />
          
          <YAxis
            dataKey="name"
            type="category"
            width={90} 
            tick={{ fontSize: 8, fontWeight: 500, fill: 'currentColor' }}
            axisLine={false}
            tickLine={false}
          />
          
          <Tooltip
            cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
            content={<CustomTooltip />}
          />
          
          <Bar
            dataKey="students"
            fill="url(#barGradient)"
            // 4. Replaced fixed barSize with maxBarSize for fluid scaling
            maxBarSize={25} 
            radius={[0, 4, 4, 0]} // Slightly softer radius looks better on thicker bars
            animationDuration={1500}
          >
            <LabelList 
              dataKey="students" 
              position="right" 
              offset={8}
              // 5. Ensured the label text scales nicely
              className="fill-slate-700 dark:fill-slate-300 font-bold text-[11px] sm:text-xs"
              formatter={(value) => `${value}`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>

  {/* --- Assessment Summary --- */}
  <Card className="border-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-500">
    <CardHeader className="pb-2">
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-2">
        <div className="space-y-1">
          <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">Assessment Funnel</CardTitle>
          <CardDescription className="text-slate-500 font-medium text-primary sm:text-sm">Evaluation lifecycle and approvals</CardDescription>
        </div>
        <div className="flex -space-x-2">
          {/* Decorative avatars for 'Assessed' feel */}
          {/* {[1, 2, 3].map((i) => (
            <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">
              {String.fromCharCode(64 + i)}
            </div>
          ))} */}
          <Badge variant={"blue"} >
            {dashboardData.assessment_summary.total_assessed_students} Assessed
          </Badge>
        </div>
      </div>
    </CardHeader>
    
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center mt-4">
        <div className="h-48 sm:h-56 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={assessmentData}
                innerRadius={65}
                outerRadius={85}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                <Cell fill="#22C55E" /> {/* Green */}
                <Cell fill="#EF4444" /> {/* Red */}
                <Cell fill="#3b82f6" /> {/* Blue */}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {/* Central Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {dashboardData.assessment_summary.total_assessed_students}
            </span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Total</span>
          </div>
        </div>

        <div className="space-y-2">
          <StatItem
            icon={UserCheck}
            label="Trainer Pool"
            value={dashboardData.assessment_summary.trainer_selected}
            variant="default"
          />
          <StatItem
            icon={CheckCircle2}
            label="Admin Approved"
            value={dashboardData.assessment_summary.admin_selected}
            variant="success"
          />
          <StatItem
            icon={XCircle}
            label="Declined"
            value={dashboardData.assessment_summary.admin_rejected}
            variant="danger"
          />
          <div className="pt-2 border-t mt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center">
                <Clock className="w-3 h-3 mr-1 text-amber-500" /> Pending
              </span>
              <span className="font-bold">{dashboardData.assessment_summary.pending_admin_review}</span>
            </div>
            <Progress 
              value={(dashboardData.assessment_summary.admin_selected / dashboardData.assessment_summary.total_assessed_students) * 100} 
              className="h-1.5 mt-2 bg-slate-100"
            />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</div>

        {/* Technology Distribution, Gender & Admission Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Technology Student Count */}
          <Card className="lg:col-span-2 border-none ring-1 ring-slate-200 dark:ring-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500">
  <CardHeader>
    <div className="flex flex-wrap items-start sm:items-center justify-between gap-2">
      <div className="space-y-1">
        <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">Technology Distribution</CardTitle>
        <CardDescription className="text-primary font-medium flex items-center text-xs sm:text-sm">
          <BookOpen className="w-3 h-3 mr-1" />
          Student enrollment breakdown by stack
        </CardDescription>
      </div>
      <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
        {technologyData.length} Technologies
      </Badge>
    </div>
  </CardHeader>
  
  <CardContent>
    <div className="h-[350px] sm:h-[400px] lg:h-[500px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={technologyData} 
          margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
        >
          {/* Custom Gradient for Bars */}
          <defs>
            <linearGradient id="techGradient" x1="0" y1="0" x2="0" y2="1">
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
            tick={{ fontSize: 8, fontWeight: 500, fill: 'currentColor' }}
            angle={-45}
            textAnchor="end"
            interval={0}
            height={80}
            axisLine={false}
            tickLine={false}
            className="text-muted-foreground sm:text-xs"
          />
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 11 }} 
            className="text-muted-foreground sm:text-xs" 
          />
          
          <Tooltip 
            cursor={{ fill: 'rgba(59, 130, 246, 0.05)', radius: 4 }}
            content={<CustomTooltip />} 
          />
          
          <Bar 
            dataKey="students" 
            fill="url(#techGradient)" 
            radius={[6, 6, 0, 0]}
            barSize={30}
            animationBegin={200}
            animationDuration={1200}
            className="sm:bar-size-[40px]"
          >
            {/* Direct Value Labels on Top of Bars */}
            <LabelList 
              dataKey="students" 
              position="top" 
              offset={10} 
              className="fill-foreground font-bold text-[10px] sm:text-xs" 
            />
            
            {technologyData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>

          {/* Gender Distribution & Admission */}
          <div className="space-y-6">
            {/* Gender Distribution */}
            <Card className="transition-all duration-300 w-full">
  <CardHeader className="pb-2">
    <CardTitle className="text-base sm:text-lg lg:text-xl font-semibold">
      Gender Distribution
    </CardTitle>
    <CardDescription className="text-primary text-xs sm:text-sm lg:text-base">
      Student demographics
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Increased and scaled heights for mobile, tablet, and desktop */}
    <div className="h-48 sm:h-56 md:h-64 lg:h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={genderStudentData}
            cx="50%"
            cy="50%"
            // Changed from hardcoded 55 to a percentage so it scales with the container
            outerRadius="75%"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
            // Made the Recharts label text responsive
            style={{ fontSize: "clamp(10px, 1.5vw, 14px)" }}
          >
            {/* Male */}
            <Cell fill="#2196F3" />
            {/* Female */}
            <Cell fill="#DB2777" />
          </Pie>

          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Added flex-wrap and responsive gaps/text sizes for the legend */}
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 sm:mt-6">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-primary" />
        <span className="text-xs sm:text-sm font-medium text-muted-foreground">Male</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-secondary" />
        <span className="text-xs sm:text-sm font-medium text-muted-foreground">Female</span>
      </div>
    </div>
  </CardContent>
</Card>

            {/* Admission Summary */}
            <Card className="transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Admission Summary</CardTitle>
                <CardDescription className="text-primary text-sm sm:text-base">Application status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Applications</span>
                  <span className="text-2xl font-bold text-foreground">
                    {dashboardData.admission_summary.total_applications}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">Selected</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {dashboardData.admission_summary.selected_yes}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive" />
                      <span className="text-sm text-muted-foreground">Rejected</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {dashboardData.admission_summary.selected_no}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-secondary" />
                      <span className="text-sm text-muted-foreground">TBD</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {dashboardData.admission_summary.selected_tbd}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Acceptance Rate</span>
                    <span className="font-medium text-foreground">
                      {dashboardData.admission_summary.total_applications > 0
                        ? ((dashboardData.admission_summary.selected_yes / dashboardData.admission_summary.total_applications) * 100).toFixed(0)
                        : 0}%
                    </span>
                  </div>
                  <Progress
                    value={
                      dashboardData.admission_summary.total_applications > 0
                        ? (dashboardData.admission_summary.selected_yes / dashboardData.admission_summary.total_applications) * 100
                        : 0
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;