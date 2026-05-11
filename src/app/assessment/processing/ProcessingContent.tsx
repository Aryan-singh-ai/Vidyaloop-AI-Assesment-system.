"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, Sparkles, Database, BarChart, FileCheck, Shield, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { QUESTIONS } from "@/lib/questions";

const STEPS = [
  { icon: Database, text: "Saving responses to secure database...", duration: 1500 },
  { icon: BarChart, text: "Calculating emotional dimension scores...", duration: 2000 },
  { icon: Brain, text: "Extracting behavioral patterns...", duration: 2500 },
  { icon: Sparkles, text: "Generating personalized AI insights...", duration: 3000 },
  { icon: FileCheck, text: "Preparing your emotional balance report...", duration: 1500 },
];

export default function ProcessingContent() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const runWork = async () => {
      // 1. Get data from localStorage
      const studentInfoStr = localStorage.getItem("studentInfo");
      const responsesStr = localStorage.getItem("assessmentResponses");

      if (!studentInfoStr || !responsesStr) {
        toast.error("No assessment data found. Redirecting to start.");
        router.push("/assessment/start");
        return;
      }

      const studentInfo = JSON.parse(studentInfoStr);
      const responsesRaw = JSON.parse(responsesStr);
      
      // Convert responses to the format expected by the API
      // { questionId: string, dimension: string, value: number }
      const responses = Object.entries(responsesRaw).map(([id, value]) => {
        const q = QUESTIONS.find(q => q.id === id);
        return {
          questionId: id,
          dimension: q?.dimension || "UNKNOWN",
          value
        };
      });

      // 2. Start the UI animation loop
      const animationPromise = (async () => {
        for (let i = 0; i < STEPS.length; i++) {
          setCurrentStep(i);
          const startProgress = (i / STEPS.length) * 100;
          const endProgress = ((i + 1) / STEPS.length) * 100;
          
          const duration = STEPS[i].duration;
          const interval = 50;
          const steps = duration / interval;
          const progressStep = (endProgress - startProgress) / steps;

          for (let j = 0; j < steps; j++) {
            setProgress(prev => Math.min(prev + progressStep, endProgress));
            await new Promise(resolve => setTimeout(resolve, interval));
          }
        }
      })();

      // 3. Make the API Call in parallel
      try {
        const response = await fetch("/api/assessment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentInfo, responses }),
        });

        if (!response.ok) throw new Error("Failed to process assessment");

        const data = await response.json();
        
        // Wait for animation to finish at least mostly
        await animationPromise;

        // Cleanup localStorage
        localStorage.removeItem("assessmentResponses");
        // We keep studentInfo for the session if needed, or remove it
        
        router.push(`/assessment/report/${data.id}`);
      } catch (error) {
        console.error(error);
        toast.error("An error occurred while processing your report. Please try again.");
        router.push("/dashboard");
      }
    };

    runWork();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl text-center space-y-12">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
            filter: ["drop-shadow(0 0 0px rgba(var(--primary), 0))", "drop-shadow(0 0 20px rgba(var(--primary), 0.3))", "drop-shadow(0 0 0px rgba(var(--primary), 0))"]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mx-auto w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center"
        >
          <Brain className="w-12 h-12 text-primary" />
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Analyzing Your Responses</h1>
          <p className="text-muted-foreground text-lg">
            Our AI is processing your input to create a comprehensive emotional profile.
          </p>
        </div>

        <div className="space-y-8">
          <div className="relative">
            <Progress value={progress} className="h-4 rounded-full" />
            <motion.div 
              style={{ left: `${progress}%` }}
              className="absolute -top-1 w-6 h-6 bg-primary rounded-full border-4 border-background shadow-lg"
            />
          </div>

          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ 
                  opacity: i <= currentStep ? 1 : 0.3,
                  x: i <= currentStep ? 0 : -10,
                  color: i === currentStep ? "hsl(var(--primary))" : "inherit"
                }}
                className="flex items-center gap-4 text-left"
              >
                <div className={`p-2 rounded-lg ${i === currentStep ? "bg-primary/20 text-primary" : "bg-muted"}`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`text-sm font-medium ${i === currentStep ? "font-bold" : ""}`}>
                  {step.text}
                </span>
                {i < currentStep && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="pt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground uppercase tracking-widest font-bold">
          <Shield className="w-4 h-4" />
          Secure AI Processing
        </div>
      </div>
    </div>
  );
}

