"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, FileText, TrendingUp, AlertTriangle, 
  Search, Filter, Download, MoreVertical, LayoutGrid, List, Brain 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";


const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444'];

export default function AdminContent() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <Brain className="w-12 h-12 text-primary animate-pulse" />
      </div>
    );
  }

  const stats = [
    { label: "Total Students", value: data.stats.totalStudents.toLocaleString(), icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Assessments Run", value: data.stats.totalAssessments.toLocaleString(), icon: FileText, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Avg Balance Score", value: `${data.stats.avgScore}%`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Critical Growth Areas", value: data.stats.criticalAreas.toString(), icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50" },
  ];

  return (
    <div className="min-h-screen bg-muted/20 p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-zinc-900 dark:text-white">Institution Analytics</h1>
            <p className="text-muted-foreground text-lg italic">Overview of emotional intelligence trends across your student population.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl h-12 gap-2 bg-white dark:bg-zinc-900">
              <Filter className="w-4 h-4" /> Filter
            </Button>
            <Button className="rounded-xl h-12 gap-2 bg-primary">
              <Download className="w-4 h-4" /> Export CSV
            </Button>
          </div>
        </header>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="premium-card border-none bg-white dark:bg-zinc-900 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <Badge variant="secondary" className="bg-muted text-muted-foreground">+0%</Badge>
              </div>
              <div>
                <p className="text-xs uppercase font-black text-muted-foreground tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 premium-card border-none bg-white dark:bg-zinc-900">
            <CardHeader>
              <CardTitle>Average Dimension Scores</CardTitle>
              <CardDescription>Comparison of average scores across all dimensions for all students.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.dimensionAverages}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  />
                  <Bar dataKey="avg" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="premium-card border-none bg-white dark:bg-zinc-900">
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>Student classification breakdown.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.classifications}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.classifications.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full mt-6 space-y-3">
                {data.classifications.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="font-medium text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Management Table */}
        <Card className="premium-card border-none bg-white dark:bg-zinc-900 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b border-border">
            <div>
              <CardTitle>Student Assessments</CardTitle>
              <CardDescription>Monitor individual student performance and report generation status.</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-10 h-10 rounded-xl bg-muted/50" />
              </div>
              <div className="flex items-center border rounded-xl p-1 bg-muted/50">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white shadow-sm"><LayoutGrid className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><List className="w-4 h-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/30 text-xs uppercase font-bold text-muted-foreground tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Student</th>
                    <th className="px-8 py-4">School / Grade</th>
                    <th className="px-8 py-4">Balance Score</th>
                    <th className="px-8 py-4">Last Assessment</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Download</th>
                    <th className="px-8 py-4">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.recentAssessments.map((assessment: any) => (
                    <tr key={assessment.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-bold">
                            {assessment.user.name?.[0] || "S"}
                          </div>
                          <div>
                            <p className="font-bold">{assessment.user.name || "Student"}</p>
                            <p className="text-xs text-muted-foreground">{assessment.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm">
                        <p className="font-medium">{assessment.user.school || "N/A"}</p>
                        <p className="text-xs text-muted-foreground text-[10px] uppercase font-bold">Grade {assessment.user.grade || "N/A"}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{Math.round(assessment.overallScore)}%</span>
                          <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${assessment.overallScore}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-muted-foreground">
                        {new Date(assessment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Completed</Badge>
                      </td>
                      <td className="px-8 py-6">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-xl h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/5"
                          onClick={(e) => {
                            e.preventDefault();
                            const link = document.createElement('a');
                            link.href = `/api/report/pdf/${assessment.id}`;
                            link.download = `Report_${assessment.user.name || 'Student'}_${assessment.id.substring(0, 8)}.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </td>
                      <td className="px-8 py-6">
                        <Button variant="ghost" size="icon" className="rounded-xl" asChild>
                          <Link href={`/assessment/report/${assessment.id}`}>
                            <MoreVertical className="w-4 h-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
