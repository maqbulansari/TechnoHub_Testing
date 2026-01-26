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

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
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
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
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
    <Card className="shadow-sm transition-all duration-300 border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
            {trend && (
              <div className="flex items-center text-sm text-primary">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>{trend}</span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-xl bg-primary/10 grid place-items-center">
            <Icon className="w-6 h-6 text-primary" />
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
        <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-lg border border-border">
          <p className="font-medium">{payload[0].payload.fullName || label}</p>
          <p className="text-primary font-semibold">{payload[0].value} students</p>
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
          fontSize={12}
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
    <div className="min-h-screen bg-background p-6 lg:p-8 print:p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your academy.
            </p>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-2 print:hidden">
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
                <Button className="gap-2" disabled={exporting}>
                  {exporting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  Export All
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
          <Card className="shadow-sm transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Recruitment Summary</CardTitle>
                  <CardDescription>Hiring and placement overview</CardDescription>
                </div>
                <Badge variant="green">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 pt-2">
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
          <Card className="shadow-sm transition-all duration-300">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Sponsorship Summary</CardTitle>
                  <CardDescription>Financial support overview</CardDescription>
                </div>
                <Badge variant="green">
                  ₹
                  {dashboardData.sponsorship_summary.total_sponsorship_amount.toLocaleString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 pt-2">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Batch Strength Chart */}
          <Card className="shadow-sm transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Batch Strength
                  </CardTitle>
                  <CardDescription>
                    Students per batch distribution
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {dashboardData.summary.batches} Batches
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="h-72 flex justify-start">
                <div className="w-full ">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={batchStrengthData}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 10,
                      }}
                      barCategoryGap="18%"
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal
                        vertical={false}
                        className="stroke-border"
                      />

                      <XAxis
                        type="number"
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />

                      <YAxis
                        dataKey="name"
                        type="category"
                        width={90}
                        tick={{
                          fontSize: 12,
                          dx: -6
                        }}
                        className="text-muted-foreground"
                      />

                      <Tooltip content={<CustomTooltip />} />

                      <Bar
                        dataKey="students"
                        barSize={24}
                        radius={[0, 6, 6, 0]}
                      >
                        {batchStrengthData.map((_, index) => (
                          <Cell
                            key={index}
                            fill={[
                              "#2196F3",
                              "#2196F3",
                              "#2196F3",
                              "#2196F3",
                              "#2196F3",
                              "#2196F3",
                            ]
                            [index % 7]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>

          </Card>



          {/* Assessment Summary */}
          <Card className="shadow-sm transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Assessment Summary</CardTitle>
                  <CardDescription>Student evaluation overview</CardDescription>
                </div>
                <Badge variant="outline">
                  {dashboardData.assessment_summary.total_assessed_students} Assessed
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assessmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill="#22C55E" /> {/* Admin Selected - Green */}
                        <Cell fill="#EF4444" /> {/* Admin Rejected - Red */}
                        <Cell fill="#2196F3" /> {/* Pending Review - Amber */}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />

                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center space-y-1">
                  <StatItem
                    icon={UserCheck}
                    label="Trainer Selected"
                    value={dashboardData.assessment_summary.trainer_selected}
                    variant="default"
                  />
                  <StatItem
                    icon={CheckCircle2}
                    label="Admin Selected"
                    value={dashboardData.assessment_summary.admin_selected}
                    variant="success"
                  />
                  <StatItem
                    icon={XCircle}
                    label="Admin Rejected"
                    value={dashboardData.assessment_summary.admin_rejected}
                    variant="danger"
                  />
                  <StatItem
                    icon={Clock}
                    label="Pending Review"
                    value={dashboardData.assessment_summary.pending_admin_review}
                    variant="warning"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technology Distribution, Gender & Admission Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Technology Student Count */}
          <Card className="lg:col-span-2 shadow-sm transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Technology Distribution</CardTitle>
              <CardDescription>Students enrolled per technology</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={technologyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      className="text-muted-foreground"
                    />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="students" radius={[4, 4, 0, 0]}>
                      {technologyData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={[
                            '#2196F3', 
                            '#2196F3', 
                            '#2196F3', 
                            '#2196F3', 
                            '#2196F3', 
                            '#2196F3',
                            '#2196F3', 
                          ][index % 7]}
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
            <Card className="shadow-sm transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Gender Distribution</CardTitle>
                <CardDescription>Student demographics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genderStudentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={55}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
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
                        }}
                      />
                    </PieChart>

                  </ResponsiveContainer>
                </div>

                <div className="flex justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">Male</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary" />
                    <span className="text-sm text-muted-foreground">Female</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admission Summary */}
            <Card className="shadow-sm transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Admission Summary</CardTitle>
                <CardDescription>Application status</CardDescription>
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