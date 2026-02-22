import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    const session = await getKindeServerSession();
    const user = await session.getUser();

    if (!user) throw new Error("Unauthorized");
    if (!prompt) throw new Error("Missing Prompt");

    const userId = user.id;

    // const projectName = await generateProjectName(prompt)

    const project = await prisma.project.create({
      data: {
        userId,
        name: ""
      }
    })

    return NextResponse.json({
        success: true,
        data: project,
    });
  } catch (error) {
    console.log("Error creating project:", error);
    return NextResponse.json({
        success: false,
        error: (error as Error).message || "An error occurred while creating the project",
    }, { status: 500 });
  }
}
