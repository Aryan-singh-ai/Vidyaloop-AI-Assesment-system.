import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        dimensionScores: true,
        report: true,
        user: true,
      },
    });

    if (!assessment) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Optional: Check if the user is the owner or an admin
    // if (assessment.userId !== userId && assessment.user.role !== "ADMIN") {
    //   return new NextResponse("Forbidden", { status: 403 });
    // }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error("[REPORT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
