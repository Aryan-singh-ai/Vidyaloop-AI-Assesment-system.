import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePDFReport } from "@/lib/pdf";
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
      return new NextResponse("Not Found", { status: 404 });
    }

    // Fallback if AI report failed to generate
    const reportData = assessment.report || {
      summary: "Detailed AI analysis is pending for this assessment.",
      strengths: ["General emotional awareness", "Consistent performance"],
      challenges: ["Growth mindset development"],
      improvementAdvice: "Continue reflecting on your emotional patterns and maintaining a balanced routine.",
      actionSteps: ["Review your scores", "Focus on your strongest dimensions"],
      dimensions: {}
    };

    // Convert dimensionScores to ScoreResult format
    const scores = assessment.dimensionScores.map(d => ({
      dimension: d.dimension as any,
      score: d.score,
      maxScore: d.maxScore,
      percentage: (d.score / d.maxScore) * 100,
      classification: d.classification,
    }));

    const pdfBuffer = await generatePDFReport(
      assessment.user.name || "Student",
      scores,
      {
        ...reportData,
        overallScore: assessment.overallScore,
      }
    );

    return new NextResponse(pdfBuffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=Emotional_Report_${id}.pdf`,
      },
    });
  } catch (error) {
    console.error("[PDF_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
