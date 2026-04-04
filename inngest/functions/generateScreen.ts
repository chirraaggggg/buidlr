// src/inngest/functions.ts
import { inngest } from "../client";
import { unsplashTool } from "../tool";
import { z } from "zod";
import { generateObject, generateText } from "ai";
import { openrouter } from "@/lib/openrouter";
import { ANALYSIS_PROMPT, GENERATION_SYSTEM_PROMPT } from "../../prompt";
import prisma from "@/lib/prisma";

const AnalysisSchema = z.object({
  theme: z
    .string()
    .describe(
      "The specific visual theme ID (e.g., 'midnight',  'ocean-breeze', 'neo-brutalism')."
    ),
  screens: z.array(
    z.object({
      id: z
        .string()
        .describe(
          "Unique identifier for the screen (e.g., 'home-dashboard', 'profile-settings', 'transaction-history'). Use kebab-case."
        ),
      name: z.string().describe("Display name (e.g., 'Home Dashboard', 'Workout Tracker')."),
      purpose: z.string().describe("One sentence describing what it does and its role in the app."),
      visualDescription: z.string().describe("VERY SPECIFIC directions for all screens, layout, components, and bottom navigation states.")
    })
  ),
});

export const generateScreen = inngest.createFunction(
  { id: "generate-ui-screens", triggers: { event: "ui/generate-screens" } },
  async ({ event, step }) => {
    const { userId, projectId, prompt, frames, theme: existingTheme } = event.data;
    const isRegeneration = frames && frames.length > 0;

    // 1. Analyze and plan the screens based on prompt
    const analysis = await step.run("analyze-and-plan-screens", async () => {
      const { object } = await generateObject({
        model: openrouter.chat("google/gemini-2.5-flash-lite"),
        schema: AnalysisSchema,
        system: ANALYSIS_PROMPT,
        prompt: `User Request: ${prompt}\n\nPlease analyze and provide the UI screens needed. ${
          isRegeneration ? "This is a regeneration/update request. Consider existing frames context." : ""
        }`,
      });
      return object;
    });

    // 2. Update the Project Theme if the AI chose one
    if (analysis.theme) {
      await step.run("update-project-theme", async () => {
        await prisma.project.update({
          where: { id: projectId },
          data: { theme: analysis.theme },
        });
      });
    }

    // 3. Generate HTML Content for each screen sequentially
    const generatedScreens: { id: string; name: string; purpose: string; visualDescription: string; htmlContent: string }[] = [];
    for (const screen of analysis.screens) {
      const htmlContent = await step.run(`generate-screen-${screen.id}`, async () => {
        const { text } = await generateText({
          model: openrouter.chat("google/gemini-2.5-flash-lite"),
          system: GENERATION_SYSTEM_PROMPT,
          prompt: `Generate the HTML code for the screen named '${screen.name}'.\nPurpose: ${screen.purpose}\n\nVisual Directions:\n${screen.visualDescription}\n\nApp Theme Selected: ${analysis.theme}`,
          tools: { searchUnsplash: unsplashTool },
        });

        let finalHtml = text ?? "";
        const match = finalHtml.match(/<div[\s\S]*<\/div>/);
        finalHtml = match ? match[0] : finalHtml;
        finalHtml = finalHtml.replace(/```(?:html)?/gi, "").replace(/```/g, "").trim();
        return finalHtml || "<div>Error generating screen</div>";
      });
      
      generatedScreens.push({ ...screen, htmlContent });
    }

    // 4. Save to Database
    await step.run("save-screens-to-db", async () => {
      for (const screen of generatedScreens) {
        await prisma.frame.create({
          data: {
            title: screen.name,
            htmlContent: screen.htmlContent,
            projectId,
          },
        });
      }
    });

    return { 
      message: `Successfully generated ${generatedScreens.length} screens.`,
      theme: analysis.theme,
      screens: generatedScreens.map(s => s.id)
    };
  }
);