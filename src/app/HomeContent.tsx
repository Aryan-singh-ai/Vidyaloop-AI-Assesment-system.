"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, BarChart3, ShieldCheck, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function HomeContent() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center p-1">
              <Brain className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight">Vidyaloop</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild className="rounded-full px-6">
              <Link href="/assessment/start">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden">
          {/* Animated Background Orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"
            />
            <motion.div 
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-[100px]"
            />
          </div>

          <div className="container mx-auto text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                Unlock Your <span className="gradient-text">Emotional Balance</span> for Academic Success
              </h1>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                Discover deep insights into your stress handling, resilience, and emotional awareness with our advanced assessment platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="rounded-full px-8 h-14 text-lg shadow-lg shadow-primary/20" asChild>
                  <Link href="/assessment/start">
                    Take the Assessment <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Emotional Intelligence Matters?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                EQ is the hidden driver of academic performance and career success. We help you measure and improve what matters most.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Dynamic Assessment",
                  description: "Science-backed questions tailored to the student experience, covering 5 key emotional dimensions.",
                  icon: Brain,
                  color: "bg-blue-500/10 text-blue-600",
                },
                {
                  title: "AI-Generated Reports",
                  description: "Personalized insights powered by advanced AI, providing deep behavioral analysis and action steps.",
                  icon: Sparkles,
                  color: "bg-purple-500/10 text-purple-600",
                },
                {
                  title: "Actionable Analytics",
                  description: "Visual dashboards that track your emotional growth over time with premium radar charts.",
                  icon: BarChart3,
                  color: "bg-indigo-500/10 text-indigo-600",
                },
                {
                  title: "Secure & Private",
                  description: "Your data is encrypted and protected. We prioritize student privacy above everything else.",
                  icon: ShieldCheck,
                  color: "bg-emerald-500/10 text-emerald-600",
                },
                {
                  title: "Premium PDF Reports",
                  description: "Download beautiful, professional reports to share with mentors, parents, or for your own records.",
                  icon: Star,
                  color: "bg-amber-500/10 text-amber-600",
                },
                {
                  title: "Student-Friendly",
                  description: "A calming, minimal interface designed to reduce assessment anxiety and promote reflection.",
                  icon: Brain,
                  color: "bg-rose-500/10 text-rose-600",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-all"
                >
                  <div className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="premium-card p-12 md:p-24 text-center text-white relative overflow-hidden bg-primary">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-indigo-600 to-violet-800 -z-10" />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to balance your emotions?</h2>
                <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                  Using Vidyaloop to improve their resilience, stress handling, and overall well-being.
                </p>
                <Button size="lg" variant="secondary" className="rounded-full px-12 h-16 text-lg font-bold" asChild>
                  <Link href="/assessment/start">Start Free Assessment</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border/50 bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Brain className="text-primary w-6 h-6" />
            <span className="font-bold text-xl">Vidyaloop</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Vidyaloop.
          </p>
        </div>
      </footer>
    </div>
  );
}
