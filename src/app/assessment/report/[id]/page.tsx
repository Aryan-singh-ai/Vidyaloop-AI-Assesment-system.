"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";
import { 
  Brain, Download, Sparkles, TrendingUp, Target, Lightbulb, 
  ChevronRight, Award, Zap, ShieldCheck, Heart 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateDimensionScores, getClassification, ScoreResult } from "@/lib/scoring";


export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState("overview");
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/report/${resolvedParams.id}`);
        if (!res.ok) throw new Error("Report not found");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [resolvedParams.id]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Brain className="w-12 h-12 text-primary animate-pulse" />
          <p className="font-bold text-muted-foreground">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find the assessment report you're looking for.</p>
          <Button asChild><a href="/dashboard">Return to Dashboard</a></Button>
        </Card>
      </div>
    );
  }

  const chartData = data.dimensionScores.map((d: any) => ({
    subject: d.dimension.replace(/_/g, " "),
    A: (d.score / d.maxScore) * 100,
    fullMark: 100,
  }));

  const overallScore = data.overallScore;
  const aiReport = data.report || {
    summary: "Your personalized AI report is being prepared. Please refresh in a moment.",
    strengths: ["Analyzing strengths..."],
    challenges: ["Identifying growth areas..."],
    improvementAdvice: "Focus on maintaining a balanced daily routine and practicing mindfulness.",
    actionSteps: ["Complete your profile", "Check back soon"],
    dimensions: {}
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-24">
      {/* Premium Header */}
      <div className="bg-white dark:bg-zinc-950 border-b border-border py-8 mb-8 sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Brain className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold tracking-tight">Emotional Balance Report</h1>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/10">Verified AI</Badge>
              </div>
              <p className="text-muted-foreground">Report ID: {resolvedParams.id} • Generated {new Date(data.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none rounded-xl h-12">
              Share Report
            </Button>
            <Button 
              className="flex-1 md:flex-none rounded-xl h-12 gap-2 bg-primary"
              onClick={() => {
                window.open(`/api/report/pdf/${resolvedParams.id}`, '_blank');
              }}
            >
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-8">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="premium-card border-none bg-primary text-white md:col-span-1">
            <CardContent className="p-8 flex flex-col justify-between h-full">
              <div>
                <p className="text-primary-foreground/80 font-medium mb-1 uppercase tracking-wider text-xs">Overall Balance</p>
                <h2 className="text-6xl font-bold mb-6">{overallScore.toFixed(0)}%</h2>
              </div>
              <div className="space-y-4">
                <Progress value={overallScore} className="bg-white/20 h-2" />
                <p className="text-sm opacity-90 leading-relaxed">
                  Your emotional balance is <span className="font-bold underline">
                    {overallScore > 80 ? "Standout" : overallScore > 60 ? "Strong" : overallScore > 40 ? "Developing" : "Emerging"}
                  </span>. You maintain a solid foundation for academic and personal growth.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card border-none bg-white dark:bg-zinc-900 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" /> AI Emotional Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-muted-foreground italic">
                "{aiReport?.summary || "Analyzing your emotional patterns..."}"
              </p>
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                  <p className="text-[10px] uppercase font-bold text-emerald-600 mb-1">Primary Strength</p>
                  <p className="font-bold">{data.dimensionScores.sort((a: any, b: any) => b.score - a.score)[0].dimension.replace(/_/g, ' ')}</p>
                </div>
                <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-center">
                  <p className="text-[10px] uppercase font-bold text-indigo-600 mb-1">Growth Area</p>
                  <p className="font-bold">Awareness</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-center col-span-2 md:col-span-1">
                  <p className="text-[10px] uppercase font-bold text-amber-600 mb-1">Trait Focus</p>
                  <p className="font-bold">Regulation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full md:w-auto grid grid-cols-2 md:inline-flex rounded-2xl p-1 bg-white dark:bg-zinc-900 border border-border shadow-sm mb-8 h-auto">
            <TabsTrigger value="overview" className="rounded-xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">Visual Overview</TabsTrigger>
            <TabsTrigger value="dimensions" className="rounded-xl px-8 py-3 data-[state=active]:bg-primary data-[state=active]:text-white">Dimension Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Radar Chart */}
              <Card className="lg:col-span-3 premium-card border-none bg-white dark:bg-zinc-900">
                <CardHeader>
                  <CardTitle>Dimension Mapping</CardTitle>
                  <CardDescription>Visualizing your scores across all 5 emotional categories.</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Emotional Dimension"
                        dataKey="A"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Insights List */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="premium-card border-none bg-white dark:bg-zinc-900 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-500" /> Key Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {aiReport.strengths.map((s: string, i: number) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                        <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                        <p className="text-sm font-medium">{s}</p>
                      </div>
                    ))}
                    <div className="pt-4 mt-4 border-t border-border">
                      <h4 className="font-bold flex items-center gap-2 mb-4 text-amber-600">
                        <Target className="w-5 h-5" /> Growth Challenges
                      </h4>
                      <div className="space-y-3">
                        {aiReport.challenges.map((c: string, i: number) => (
                          <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                            <ChevronRight className="w-4 h-4 text-amber-500" /> {c}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dimensions" className="space-y-12 outline-none">
            {data.dimensionScores.map((dim: any, i: number) => {
              const analysis = aiReport.dimensions?.[dim.dimension];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Card className="premium-card border-none bg-white dark:bg-zinc-900 overflow-hidden">
                    <div className="h-2 bg-primary" />
                    <CardHeader className="pb-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Brain className="w-6 h-6" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-bold">{dim.dimension.replace(/_/g, " ")}</CardTitle>
                            <Badge variant="outline" className="uppercase text-[10px] tracking-widest mt-1">{dim.classification}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Dimension Score</p>
                          <p className="text-3xl font-black text-primary">{Math.round((dim.score / dim.maxScore) * 100)}%</p>
                        </div>
                      </div>
                      <Progress value={(dim.score / dim.maxScore) * 100} className="h-2" />
                    </CardHeader>
                    <CardContent className="space-y-8 pt-4">
                      {/* Summary */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> Dimension Summary
                        </h4>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                          {analysis?.summary || "Personalized analysis for this dimension is being processed..."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Strengths */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                            <Award className="w-4 h-4" /> Key Strengths
                          </h4>
                          <div className="space-y-3">
                            {analysis?.strengths.map((s: string, j: number) => (
                              <div key={j} className="flex gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                <p className="text-sm font-medium">{s}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Challenges */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-black uppercase tracking-widest text-amber-600 flex items-center gap-2">
                            <Target className="w-4 h-4" /> Growth Areas
                          </h4>
                          <div className="space-y-3">
                            {analysis?.challenges.map((c: string, j: number) => (
                              <div key={j} className="flex gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                <p className="text-sm font-medium">{c}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Advice & Action Steps */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 border-t border-border">
                        <div className="lg:col-span-2 space-y-4">
                          <h4 className="text-sm font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" /> Improvement Advice
                          </h4>
                          <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                            <p className="text-muted-foreground leading-relaxed font-medium italic">
                              {analysis?.improvementAdvice}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Action Steps
                          </h4>
                          <div className="space-y-3">
                            {analysis?.actionSteps.map((step: string, j: number) => (
                              <div key={j} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border">
                                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                                  {j + 1}
                                </div>
                                <p className="text-xs font-bold">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* Overall Snapshot / Final Encouragement */}
        <Card className="premium-card border-none bg-zinc-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] -z-0" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-3xl font-bold flex items-center gap-3">
              <Heart className="w-8 h-8 text-rose-500" /> Overall Emotional Snapshot
            </CardTitle>
            <CardDescription className="text-zinc-400 text-lg">
              Consolidated assessment results and final roadmap for your emotional growth.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 p-8 pt-4">
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6" /> Recommended Focus Areas
                </h4>
                <p className="text-zinc-300 leading-relaxed text-lg">
                  {aiReport.improvementAdvice}
                </p>
              </div>
              <div className="p-8 rounded-3xl bg-primary/10 border border-primary/20">
                <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-white">
                   Final Encouragement Note
                </h4>
                <p className="text-zinc-300 italic">
                  {aiReport.summary}
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-amber-400 flex items-center gap-2">
                <Target className="w-6 h-6" /> Top Action Steps
              </h4>
              <div className="space-y-4">
                {aiReport.actionSteps.map((step: string, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <p className="font-medium text-zinc-100">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <div className="flex flex-col md:flex-row items-center justify-between p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-border">
          <div className="flex items-center gap-6 mb-6 md:mb-0">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Need someone to talk to?</h3>
              <p className="text-muted-foreground">This assessment is a tool for self-awareness. If you're feeling overwhelmed, please reach out to a professional counselor.</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-xl h-12 px-8">Find Support Resources</Button>
        </div>
      </div>
    </div>
  );
}
