import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json([]);
    }
    
    const userId = email;

    const assessments = await prisma.assessment.findMany({
      where: { userId },
      include: {
        report: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(assessments);
  } catch (error) {
    console.error("[USER_ASSESSMENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
