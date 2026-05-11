import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // Admin stats are now public for this simplified version

    // Optional: Check if user is admin
    // const user = await prisma.user.findUnique({ where: { id: userId } });
    // if (user?.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

    const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
    const totalAssessments = await prisma.assessment.count();
    
    const avgScoreResult = await prisma.assessment.aggregate({
      _avg: {
        overallScore: true,
      },
    });
    const avgScore = Math.round(avgScoreResult._avg.overallScore || 0);

    const dimensionAverages = await prisma.dimensionScore.groupBy({
      by: ["dimension"],
      _avg: {
        score: true,
      },
    });

    const recentAssessments = await prisma.assessment.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });

    const classificationCounts = await prisma.dimensionScore.groupBy({
      by: ["classification"],
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      stats: {
        totalStudents,
        totalAssessments,
        avgScore,
        criticalAreas: 0, // Placeholder for logic
      },
      dimensionAverages: dimensionAverages.map(d => ({
        name: d.dimension.replace(/_/g, " "),
        avg: Math.round((d._avg.score || 0) / 40 * 100), // Assuming maxScore 40
      })),
      recentAssessments,
      classifications: classificationCounts.map(c => ({
        name: c.classification,
        value: c._count.id,
      })),
    });
  } catch (error) {
    console.error("[ADMIN_STATS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
