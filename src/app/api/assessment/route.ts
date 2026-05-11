import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateDimensionScores, calculateOverallBalance } from "@/lib/scoring";
import { generateAIReport } from "@/lib/ai";
export async function POST(req: Request) {
  try {
    const { studentInfo, responses } = await req.json();
    const userId = studentInfo.email; // Use email as the identifier for guest users

    // 0. Ensure user exists
    await prisma.user.upsert({
      where: { id: userId },
      update: {
        name: studentInfo.fullName,
        school: studentInfo.schoolName,
        grade: studentInfo.grade,
        age: studentInfo.age,
      },
      create: {
        id: userId,
        email: studentInfo.email,
        name: studentInfo.fullName,
        school: studentInfo.schoolName,
        grade: studentInfo.grade,
        age: studentInfo.age,
      },
    });

    // 1. Calculate scores
    const dimensionScores = calculateDimensionScores(responses);
    const overallBalance = calculateOverallBalance(dimensionScores);

    // 2. Create assessment record
    const assessment = await prisma.assessment.create({
      data: {
        userId,
        overallScore: overallBalance,
        dimensionScores: {
          create: dimensionScores.map(d => ({
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

    // 3. Generate AI Report
    const aiData = await generateAIReport(studentInfo.fullName, dimensionScores, overallBalance);

    // 4. Save Generated Report
    await prisma.generatedReport.create({
      data: {
        assessmentId: assessment.id,
        summary: aiData.summary,
        strengths: aiData.strengths,
        challenges: aiData.challenges,
        improvementAdvice: aiData.improvementAdvice,
        actionSteps: aiData.actionSteps,
        dimensions: aiData.dimensions as any, // Save the detailed per-dimension analysis
      },
    });

    return NextResponse.json({ id: assessment.id });
  } catch (error) {
    console.error("[ASSESSMENT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
