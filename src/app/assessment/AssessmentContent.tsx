"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QUESTIONS } from "@/lib/questions";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

const LIKERT_OPTIONS = [
  { label: "Strongly Disagree", value: 1, color: "bg-rose-500/10 text-rose-600 border-rose-200" },
  { label: "Disagree", value: 2, color: "bg-orange-500/10 text-orange-600 border-orange-200" },
  { label: "Neutral", value: 3, color: "bg-amber-500/10 text-amber-600 border-amber-200" },
  { label: "Agree", value: 4, color: "bg-emerald-500/10 text-emerald-600 border-emerald-200" },
  { label: "Strongly Agree", value: 5, color: "bg-green-500/10 text-green-600 border-green-200" },
];

export default function AssessmentContent() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentInfo, setStudentInfo] = useState<any>(null);

  useEffect(() => {
    const info = localStorage.getItem("studentInfo");
    if (!info) {
      router.push("/assessment/start");
    } else {
      setStudentInfo(JSON.parse(info));
    }
  }, [router]);

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  const handleSelect = (value: number) => {
    const newResponses = { ...responses, [currentQuestion.id]: value };
    setResponses(newResponses);

    // Auto-advance with small delay
    if (currentIndex < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Store responses in localStorage so the processing page can pick them up
    localStorage.setItem("assessmentResponses", JSON.stringify(responses));
    router.push("/assessment/processing");
  };

  if (!studentInfo) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Emotional Balance Assessment</h2>
              <p className="text-sm text-muted-foreground">Dimension: {currentQuestion.dimension.replace(/_/g, " ")}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-primary">{currentIndex + 1} / {QUESTIONS.length}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-3 rounded-full" />
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            <span>Start</span>
            <span>Focus</span>
            <span>Finish</span>
          </div>
        </div>

        {/* Question Card */}
        <div className="relative min-h-[400px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
              className="w-full"
            >
              <Card className="premium-card border-none shadow-xl overflow-hidden bg-white dark:bg-zinc-900">
                <CardContent className="p-12 text-center space-y-10">
                  <Badge variant="outline" className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
                    {currentQuestion.dimension.replace(/_/g, " ")}
                  </Badge>
                  
                  <h3 className="text-2xl md:text-3xl font-semibold leading-tight text-zinc-800 dark:text-zinc-100">
                    &ldquo;{currentQuestion.text}&rdquo;
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {LIKERT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                        className={`
                          group relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200
                          ${responses[currentQuestion.id] === option.value 
                            ? `${option.color} border-current scale-105 shadow-md` 
                            : 'border-transparent bg-muted/50 hover:bg-muted hover:border-muted-foreground/20'}
                        `}
                      >
                        <div className={`
                          w-3 h-3 rounded-full mb-3 transition-transform group-hover:scale-125
                          ${responses[currentQuestion.id] === option.value ? 'bg-current' : 'bg-muted-foreground/30'}
                        `} />
                        <span className="text-[11px] font-bold uppercase leading-tight">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentIndex === 0 || isSubmitting}
            className="rounded-full px-6"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Previous
          </Button>

          {currentIndex === QUESTIONS.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!responses[currentQuestion.id] || isSubmitting}
              className="rounded-full px-8 h-12 bg-primary shadow-lg shadow-primary/20"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="mr-2 w-4 h-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  Finalize & Submit <CheckCircle2 className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              disabled={!responses[currentQuestion.id]}
              className="rounded-full px-8 h-12"
            >
              Next <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
