# Vidyaloop-AI-Assesment-system
Assessment to analyze your psychometric score and understand academic perception.

## Emotional Balance Assessment Platform

Vidyaloop is a premium, AI-powered emotional intelligence assessment platform designed specifically for students. It helps identify patterns in stress handling, emotional regulation, resilience, awareness, and social comfort.

## Features

- **Dynamic Assessment**: 40-question scientific assessment across 5 key emotional dimensions.
- **AI-Powered Insights**: Personalized emotional reports generated using OpenAI GPT-4o.
- **Premium Analytics**: Interactive radar charts and dimension breakdowns using Recharts.
- **Downloadable PDF Reports**: Professional, high-fidelity PDF reports generated via Puppeteer.
- **Student Dashboard**: Track assessment history and emotional growth over time.
- **Admin Dashboard**: Institutional-level analytics and student population management.
- **Clerk Authentication**: Secure, enterprise-grade authentication for students and admins.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion.
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL.
- **AI**: OpenAI API.
- **PDF**: Puppeteer.

## Deployment

This platform is optimized for deployment on **Vercel**. 
Ensure you configure the environment variables in the Vercel project settings.
Note: For PDF generation on Vercel, this project uses `@sparticuz/chromium`.
