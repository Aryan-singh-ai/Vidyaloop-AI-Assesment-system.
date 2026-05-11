"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Brain, User, GraduationCap, School, Calendar } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  schoolName: z.string().min(2, { message: "School name is required." }),
  grade: z.string().min(1, { message: "Class/Grade is required." }),
  age: z.string().min(1, { message: "Age is required." }),
  email: z.string().email({ message: "Invalid email address." }),
});

interface FormValues {
  fullName: string;
  schoolName: string;
  grade: string;
  age: string;
  email: string;
}

export default function StartContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      schoolName: "",
      grade: "",
      age: "",
      email: "",
    },
  });


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // In a real app, we might save this to session or DB
    // For now, we'll store it in localStorage to persist during the assessment session
    localStorage.setItem("studentInfo", JSON.stringify(values));
    
    // Simulate delay
    setTimeout(() => {
      router.push("/assessment");
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
          <div className="h-3 bg-primary" />
          <CardHeader className="space-y-4 pt-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Student Onboarding</CardTitle>
            <CardDescription className="text-lg">
              We need a few details to personalize your emotional balance assessment.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Aryan Singh" className="pl-10 h-12 rounded-xl" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="aryan@vidyaloop.in" className="h-12 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="schoolName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School/College Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <School className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                              <Input placeholder="Delhi Public School" className="pl-10 h-12 rounded-xl" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class/Grade</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Class 10" className="pl-10 h-12 rounded-xl" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="max-w-[150px]">
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input type="number" placeholder="16" className="pl-10 h-12 rounded-xl" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button type="submit" size="lg" className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                    {isLoading ? "Preparing Assessment..." : "Begin Assessment"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
