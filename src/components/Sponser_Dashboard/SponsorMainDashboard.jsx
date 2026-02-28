import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/authContext";
import Loading from "@/Loading";
import { Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Users, IndianRupee, Handshake, CheckCircle } from "lucide-react";
import bgSponser from "../../assets/images/sponserDashboard/bgSponser.png";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts";

const SponsorMainDashboard = () => {
    const { API_BASE_URL, accessToken, role, responseSubrole } = useContext(AuthContext);

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [batchFilter, setBatchFilter] = useState("all");

    useEffect(() => {
        let isMounted = true;

        const fetchDashboardData = async () => {
            // Allow only Sponsor Subrole or Admin viewing as Sponsor
            if (!(role === "ADMIN" || role === "SPONSOR" || responseSubrole?.includes("SPONSOR"))) return;

            try {
                const res = await axios.get(`${API_BASE_URL}/sponsor-dashboard/`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                if (isMounted) {
                    setDashboardData(res.data);
                }
            } catch (err) {
                console.error("Error fetching sponsor dashboard data:", err);
                if (isMounted) setError("Unable to fetch dashboard details at this moment.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchDashboardData();
        return () => { isMounted = false; };
    }, [API_BASE_URL, accessToken, role, responseSubrole]);

    const students = dashboardData?.sponsored_students || [];
    const summary = dashboardData?.summary || {
        total_sponsored_students: 0,
        total_amount_contributed: 0,
        payment_status_summary: { successful: 0, pending: 0, failed: 0 }
    };
    const sponsorName = dashboardData?.sponsor_name || "Valued Sponsor";

    const batchList = useMemo(() => [...new Set(students.map(s => s.batch_name))].filter(Boolean), [students]);

    const filteredStudents = useMemo(() => {
        return students
            .filter(s => batchFilter === "all" || s.batch_name === batchFilter)
            .sort((a, b) => new Date(a.payment_date) - new Date(b.payment_date)); // Sort oldest first for timeline
    }, [students, batchFilter]);

    // Data preparation for charts
    const batchDataMap = {};
    filteredStudents.forEach(s => {
        if (!batchDataMap[s.batch_name]) {
            batchDataMap[s.batch_name] = { name: s.batch_name, students: 0, amount: 0 };
        }
        batchDataMap[s.batch_name].students += 1;
        batchDataMap[s.batch_name].amount += s.amount;
    });
    const batchChartData = Object.values(batchDataMap);

    const paymentStatusData = [
        { name: 'Successful', value: summary.payment_status_summary.successful, color: '#10b981' }, // emrald-500
        { name: 'Pending', value: summary.payment_status_summary.pending, color: '#f59e0b' },     // amber-500
        { name: 'Failed', value: summary.payment_status_summary.failed, color: '#ef4444' }        // red-500
    ].filter(item => item.value > 0);

    // Growth over time data (cumulative)
    let cumulativeAmount = 0;
    const growthData = filteredStudents.map(s => {
        cumulativeAmount += s.amount;
        return {
            date: new Date(s.payment_date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
            amount: cumulativeAmount,
            name: s.student_name
        };
    });


    // Custom Tooltips
    const CustomBarTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
                    <p className="font-semibold text-slate-800 mb-1">{label}</p>
                    <p className="text-sm text-blue-600 font-medium">
                        Students: {payload[0].value}
                    </p>
                    <p className="text-sm text-emerald-600 font-medium">
                        Amount: ₹ {payload[1].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomLineTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
                    <p className="font-semibold text-slate-800 mb-1">{label}</p>
                    <p className="text-xs text-slate-500 mb-1">Sponsored: {payload[0].payload.name}</p>
                    <p className="text-sm text-indigo-600 font-bold">
                        Total: ₹ {payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomLegend = ({ payload }) => {
        if (!payload || !payload.length) return null;
        return (
            <div className="flex justify-center flex-wrap items-center gap-6 mt-4 w-full">
                {payload.map((entry, index) => (
                    <div key={`item-${index}`} className="flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 12 12" className="flex-shrink-0">
                            <circle cx="6" cy="6" r="6" fill={entry.color} />
                        </svg>
                        <span className="text-sm font-medium text-slate-700 whitespace-nowrap">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-[#f8f9fa] mt-20 pb-40">
            <style>{`
                .recharts-wrapper, .recharts-surface {
                    outline: none !important;
                }
                .recharts-wrapper * {
                    outline: none !important;
                }
            `}</style>
            <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">



                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 shadow-sm flex items-center justify-center">
                        <span className="font-semibold">{error}</span>
                    </div>
                )}

                {/* SUMMARY STATS GRID */}
                {!error && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">

                        {/* Stat 1: Total Contributed */}
                        <Card className="border shadow-sm rounded-xl bg-white">
                            <CardContent className="p-6 flex items-center gap-5 h-full">
                                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <IndianRupee className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Total Contribution</p>
                                    <h3 className="text-3xl font-bold text-slate-800 flex items-baseline gap-1">
                                        <span className="text-lg text-slate-500">₹</span>
                                        {summary.total_amount_contributed.toLocaleString()}
                                    </h3>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stat 2: Total Students */}
                        <Card className="border shadow-sm rounded-xl bg-white">
                            <CardContent className="p-6 flex items-center gap-5 h-full">
                                <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                                    <Users className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Students Sponsored</p>
                                    <h3 className="text-3xl font-bold text-slate-800">
                                        {summary.total_sponsored_students}
                                    </h3>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stat 3: Payment Status Summary */}
                        <Card className="border shadow-sm rounded-xl bg-white">
                            <CardContent className="p-6 flex items-center gap-5 h-full">
                                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">Successful Payments</p>
                                    <h3 className="text-3xl font-bold text-slate-800">
                                        {summary.payment_status_summary.successful}
                                    </h3>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                )}

                {/* CHARTS SECTION */}
                {!error && (
                    <div className="space-y-6">

                        {/* Filters */}
                        <div className="flex justify-end mb-2">
                            <Select value={batchFilter} onValueChange={setBatchFilter}>
                                <SelectTrigger className="w-full sm:w-64 bg-white border-slate-200 rounded-lg shadow-sm">
                                    <SelectValue placeholder="All Batches" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg">
                                    <SelectItem value="all">All Batches</SelectItem>
                                    {batchList.map(batch => (
                                        <SelectItem key={batch} value={batch}>{batch}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Batch Distribution (Bar Chart) */}
                            <Card className="border shadow-sm rounded-xl bg-white lg:col-span-2">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-semibold text-slate-800">Distribution by Batch</CardTitle>
                                    <CardDescription>Number of students and amount sponsored per batch</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px] w-full mt-4">
                                        {batchChartData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%" className="focus:outline-none" style={{ outline: 'none' }}>
                                                <BarChart data={batchChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} style={{ outline: 'none' }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                                    <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f1f5f9' }} />
                                                    <Legend content={<CustomLegend />} />
                                                    <Bar yAxisId="left" dataKey="students" name="Students" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} style={{ outline: 'none' }} />
                                                    <Bar yAxisId="right" dataKey="amount" name="Amount (₹)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} style={{ outline: 'none' }} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Status (Pie Chart) */}
                            <Card className="border shadow-sm rounded-xl bg-white">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-semibold text-slate-800">Payment Status</CardTitle>
                                    <CardDescription>Overview of transaction states</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px] w-full mt-4 flex flex-col items-center justify-center">
                                        {paymentStatusData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%" className="focus:outline-none" style={{ outline: 'none' }}>
                                                <PieChart style={{ outline: 'none' }}>
                                                    <Pie
                                                        data={paymentStatusData}
                                                        cx="50%"
                                                        cy="45%"
                                                        innerRadius={60}
                                                        outerRadius={90}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                        style={{ outline: 'none' }}
                                                    >
                                                        {paymentStatusData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        formatter={(value) => [`${value} Transactions`, 'Status']}
                                                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                    />
                                                    <Legend content={<CustomLegend />} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contribution Timeline (Line Chart) */}
                            <Card className="border shadow-sm rounded-xl bg-white lg:col-span-3">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-semibold text-slate-800">Sponsorship Growth Timeline</CardTitle>
                                    <CardDescription>Cumulative amount contributed over time</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[350px] w-full mt-4">
                                        {growthData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%" className="focus:outline-none" style={{ outline: 'none' }}>
                                                <LineChart data={growthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} style={{ outline: 'none' }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} padding={{ left: 30, right: 30 }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
                                                    <Tooltip content={<CustomLineTooltip />} />
                                                    <Legend content={<CustomLegend />} />
                                                    <Line type="monotone" dataKey="amount" name="Total Contributed" stroke="#585ce5" strokeWidth={3} dot={{ r: 4, fill: '#585ce5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#585ce5', stroke: '#fff', strokeWidth: 2 }} style={{ outline: 'none' }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SponsorMainDashboard;
