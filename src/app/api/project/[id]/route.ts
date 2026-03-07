import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) throw new Error("Unauthorized");

    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        frames: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json(
      {
        error: "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const { id } = await params;
    const body = await request.json();
    const { theme, thumbnail } = body;

    const updated = await prisma.project.update({
      where: { id, userId: user.id },
      data: {
        ...(theme !== undefined && { theme }),
        ...(thumbnail !== undefined && { thumbnail }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.log("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

