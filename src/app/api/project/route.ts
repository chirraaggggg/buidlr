import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateProjectName } from "@/app/action/action";

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

    let projectName = "Untitled Project";
    try {
      projectName = await generateProjectName(prompt);
    } catch (e) {
      console.error("Failed to generate project name:", e);
    }

    const project = await prisma.project.create({
      data: {
        userId,
        name: projectName,
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
