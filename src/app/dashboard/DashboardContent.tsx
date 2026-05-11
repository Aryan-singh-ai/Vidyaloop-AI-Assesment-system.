"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Brain, FileText, Calendar, ChevronRight, 
  PlusCircle, LayoutDashboard, History as HistoryIcon, Settings, LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


export default function DashboardContent() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Read email from localStorage (set during assessment start)
        const studentInfoStr = localStorage.getItem("studentInfo");
        const email = studentInfoStr ? JSON.parse(studentInfoStr).email : null;
        const url = email
          ? `/api/user/assessments?email=${encodeURIComponent(email)}`
          : "/api/user/assessments";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const totalAssessments = history.length;
  const avgBalance = totalAssessments > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.overallScore, 0) / totalAssessments)
    : 0;
  
  const lastImprovement = history.length >= 2
    ? Math.round(history[0].overallScore - history[1].overallScore)
    : 0;

  return (
    <div className="min-h-screen bg-muted/20 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-border hidden lg:flex flex-col p-6 sticky top-0 h-screen">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <Brain className="text-primary w-8 h-8" />
          <span className="font-bold text-xl">Vidyaloop</span>
        </Link>
        
        <nav className="space-y-2 flex-grow">
          <NavItem icon={LayoutDashboard} label="Dashboard" active />
          <NavItem icon={HistoryIcon} label="History" />
          <NavItem icon={Settings} label="Settings" />
        </nav>

        <div className="pt-6 border-t border-border">
          <NavItem icon={LogOut} label="Logout" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Welcome Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back!</h1>
              <p className="text-muted-foreground text-lg italic">"Emotions are the colors of the soul; keep your palette balanced."</p>
            </div>
            <Button size="lg" className="rounded-2xl h-14 px-8 gap-2 bg-primary shadow-lg shadow-primary/20" asChild>
              <Link href="/assessment/start">
                <PlusCircle className="w-5 h-5" /> New Assessment
              </Link>
            </Button>
          </header>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Total Assessments" value={totalAssessments.toString()} icon={FileText} />
            <StatCard label="Average Balance" value={`${avgBalance}%`} icon={Brain} />
            <StatCard label="Last Improvement" value={`${lastImprovement > 0 ? '+' : ''}${lastImprovement}%`} icon={ChevronRight} trend={lastImprovement >= 0 ? "up" : "down"} />
          </div>

          {/* Recent Reports */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Recent Emotional Reports</h2>
              <Button variant="link" className="text-primary">View all history</Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="py-20 flex justify-center">
                  <Brain className="w-10 h-10 text-primary animate-pulse" />
                </div>
              ) : history.length === 0 ? (
                <Card className="p-12 text-center border-dashed border-2 bg-transparent">
                  <p className="text-muted-foreground mb-4">You haven't taken any assessments yet.</p>
                  <Button asChild><Link href="/assessment/start">Start Your First Assessment</Link></Button>
                </Card>
              ) : (
                history.map((report, i) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link href={`/assessment/report/${report.id}`}>
                      <Card className="premium-card border-none bg-white dark:bg-zinc-900 hover:bg-muted/50 transition-all p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg">{report.id.substring(0, 8).toUpperCase()}</span>
                              <Badge variant="outline" className="text-[10px] uppercase">Full Assessment</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(report.createdAt).toLocaleDateString()}</span>
                              <span className="flex items-center gap-1">• {report.overallScore >= 70 ? 'Standout' : report.overallScore >= 50 ? 'Strong' : 'Developing'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="rounded-xl h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/5"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const link = document.createElement('a');
                                link.href = `/api/report/pdf/${report.id}`;
                                link.download = `Report_${report.id.substring(0, 8)}.pdf`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                            >
                              <FileText className="w-5 h-5" />
                            </Button>
                            <div className="text-right min-w-[80px]">
                              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Balance Score</p>
                              <p className="text-2xl font-black text-primary">{Math.round(report.overallScore)}%</p>
                            </div>
                          </div>
                          <ChevronRight className="w-6 h-6 text-muted-foreground" />
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* AI Tip of the Day */}
          <Card className="premium-card border-none bg-zinc-900 text-white p-8 relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary/20 blur-[60px]" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center shrink-0">
                <Brain className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-4 text-center md:text-left">
                <Badge className="bg-primary/20 text-primary border-primary/20 hover:bg-primary/20">AI Tip of the Day</Badge>
                <h3 className="text-2xl font-bold">Focus on Emotional Granularity</h3>
                <p className="text-zinc-400 max-w-2xl">
                  Being able to differentiate between similar emotions (like "annoyance" vs "disappointment") is a key step in building emotional intelligence. Try to label your feelings precisely today.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'}`}>
      <Icon className="w-5 h-5" />
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );
}

function StatCard({ label, value, icon: Icon, trend }: { label: string, value: string, icon: any, trend?: "up" | "down" }) {
  return (
    <Card className="premium-card border-none bg-white dark:bg-zinc-900 p-6 flex items-center gap-6">
      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
    </Card>
  );
}
