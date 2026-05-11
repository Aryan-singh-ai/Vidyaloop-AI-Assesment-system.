import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePDFReport } from "@/lib/pdf";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        user: true,
        dimensionScores: true,
        report: true,
      },
    });

    if (!assessment) {
      return new NextResponse("Assessment not found", { status: 404 });
    }

    // Use the saved AI report if available, otherwise use structured fallback content
    const reportData = assessment.report
      ? {
          summary: assessment.report.summary,
          strengths: assessment.report.strengths,
          challenges: assessment.report.challenges,
          improvementAdvice: assessment.report.improvementAdvice,
          actionSteps: assessment.report.actionSteps,
          dimensions: (assessment.report.dimensions as Record<string, any>) ?? {},
          overallScore: assessment.overallScore,
        }
      : {
          summary:
            "Your emotional assessment reveals a thoughtful and self-aware individual with great potential for growth.",
          strengths: [
            "Strong self-awareness and reflective capacity",
            "Genuine motivation for emotional growth",
            "Ability to persevere through challenges",
          ],
          challenges: [
            "Developing consistent emotional regulation strategies",
            "Building resilience during stressful situations",
          ],
          improvementAdvice:
            "Focus on one emotional dimension at a time. Small, consistent habits—like journaling and mindfulness—yield the greatest long-term improvement.",
          actionSteps: [
            "Start a daily 5-minute reflection journal.",
            "Practice a calming breathing exercise before stressful events.",
            "Identify one mentor to check in with weekly.",
          ],
          dimensions: {},
          overallScore: assessment.overallScore,
        };

    // Convert dimensionScores to ScoreResult format
    const scores = assessment.dimensionScores.map((d) => ({
      dimension: d.dimension as any,
      score: d.score,
      maxScore: d.maxScore,
      percentage: (d.score / d.maxScore) * 100,
      classification: d.classification,
    }));

    const pdfBuffer = await generatePDFReport(
      assessment.user.name || "Student",
      scores,
      reportData
    );

    return new NextResponse(pdfBuffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Emotional_Report_${id}.pdf"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("[PDF_GET]", error?.message || error);
    return new NextResponse(JSON.stringify({ 
      error: "Failed to generate PDF report", 
      details: error?.message || "Unknown error" 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

