import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateProjectName, generateAppDesign } from "@/app/action/action";

export async function GET() {
  try {
    const session = await getKindeServerSession();
    const user = await session.getUser();

    if (!user) throw new Error("Unauthorized");

    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
      },
      take: 10,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          (error as Error).message ||
          "An error occurred while fetching projects",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Missing Prompt" },
        { status: 400 }
      );
    }

    const userId = user.id;

    // Generate name and HTML design in parallel
    const [projectName, htmlContent] = await Promise.all([
      generateProjectName(prompt).catch(() => "Untitled Project"),
      generateAppDesign(prompt),
    ]);

    // Create project + initial frame in a single transaction-like flow
    const project = await prisma.project.create({
      data: {
        userId,
        name: projectName,
        frames: {
          create: {
            title: projectName,
            htmlContent,
          },
        },
      },
      include: {
        frames: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          (error as Error).message ||
          "An error occurred while creating the project",
      },
      { status: 500 }
    );
  }
}

