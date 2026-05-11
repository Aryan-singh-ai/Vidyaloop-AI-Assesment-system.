import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateDimensionScores, calculateOverallBalance } from "@/lib/scoring";
import { generateAIReport } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { studentInfo, responses } = await req.json();

    if (!studentInfo?.email || !responses?.length) {
      return new NextResponse("Missing studentInfo or responses", { status: 400 });
    }

    const email = studentInfo.email as string;

    // 0. Find or create the user — upsert by email (which is used as the id)
    // Use email as both the id AND the unique email lookup to avoid duplicate email errors
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: studentInfo.fullName,
        school: studentInfo.schoolName,
        grade: studentInfo.grade,
        age: parseInt(studentInfo.age, 10) || null,
      },
      create: {
        id: email,           // Use email as the stable user ID
        email,
        name: studentInfo.fullName,
        school: studentInfo.schoolName,
        grade: studentInfo.grade,
        age: parseInt(studentInfo.age, 10) || null,
      },
    });

    const userId = user.id;

    // 1. Calculate scores
    const dimensionScores = calculateDimensionScores(responses);
    const overallBalance = calculateOverallBalance(dimensionScores);

    // 2. Create assessment record
    const assessment = await prisma.assessment.create({
      data: {
        userId,
        overallScore: overallBalance,
        dimensionScores: {
          create: dimensionScores.map((d) => ({
            dimension: d.dimension,
            score: d.score,
            maxScore: d.maxScore,
            classification: d.classification,
          })),
        },
        responses: {
          create: responses.map((r: any) => ({
            questionId: r.questionId,
            dimension: r.dimension,
            value: r.value,
          })),
        },
      },
    });

    // 3. Generate AI Report (non-blocking — if AI fails, the assessment is still saved)
    try {
      const aiData = await generateAIReport(
        studentInfo.fullName,
        dimensionScores,
        overallBalance
      );

      // 4. Save the Generated Report
      await prisma.generatedReport.create({
        data: {
          assessmentId: assessment.id,
          summary: aiData.summary,
          strengths: aiData.strengths,
          challenges: aiData.challenges,
          improvementAdvice: aiData.improvementAdvice,
          actionSteps: aiData.actionSteps,
          dimensions: aiData.dimensions as any,
        },
      });
    } catch (aiError: any) {
      // Log AI failure but don't crash — the report page has fallback content
      console.error("[ASSESSMENT_POST] AI report generation failed:", aiError?.message);
    }

    return NextResponse.json({ id: assessment.id });
  } catch (error: any) {
    console.error("[ASSESSMENT_POST]", error?.message || error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
