"use server";
import { openrouter } from "@/lib/openrouter";
import { generateText } from "ai";

export async function generateProjectName(prompt: string) {
  try {
    const { text } = await generateText({
      model: openrouter.chat("google/gemini-2.5-flash-lite"),
      system: `
        You are an AI assistant that generates very very short project names based on
        the user's prompt.
        - Keep it under 5 words.
        - Capitalize words appropriately.
        - Do not include special characters.
      `,
      prompt: prompt,
    });
    return text?.trim() || "Untitled Project";
  } catch (error) {
    console.log(error);
    return "Untitled Project";
  }
}

/**
 * Generate a mobile app UI design as HTML from a user prompt.
 * Returns raw HTML (body content only, no <html>/<head> wrapper —
 * that is handled by frame-wrapper.ts).
 */
export async function generateAppDesign(prompt: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: openrouter.chat("google/gemini-2.5-flash-lite"),
      system: `You are an expert mobile UI designer. Given a user's app idea, generate a COMPLETE, beautiful mobile app screen as HTML.

RULES:
- Output ONLY the HTML body content (no <!DOCTYPE>, <html>, <head>, or <body> tags — those are added externally).
- Use Tailwind CSS classes for ALL styling (Tailwind is loaded externally via CDN).
- Design for a 375px × 812px mobile viewport (iPhone-sized).
- Use the "Inter" font family (it is loaded externally).
- Create a realistic, premium, modern mobile app UI — NOT a wireframe.

CRITICAL UI RULES:
- DO NOT wrap the app in a device frame, mockup container, phone silhouette, or any outer border.
- The root element must naturally fill 100% of the viewport (w-full h-full or min-h-screen).
- DO NOT use max-width centering on the root element (e.g. no max-w-md mx-auto). It must span edge-to-edge.

- Include realistic sample data, icons (use emoji or SVG), and proper spacing.
- Use a clean color palette appropriate for the app type.
- Include common mobile UI patterns: status bar area, navigation, cards, buttons, bottom nav, etc.
- Make it visually stunning — use gradients, shadows, rounded corners, proper typography hierarchy.
- The entire UI must fit within the viewport without horizontal scrolling.
- Do NOT include any <script> tags or JavaScript.
- Do NOT include markdown formatting, code fences, or backticks — output pure HTML only.
- Do NOT include any explanation text, only the HTML.`,
      prompt: `Design a mobile app screen for: ${prompt}. Remember: Edge-to-edge design, NO phone mockups or padding around the edges.`,
    });

    // Strip any markdown code fences the model might have included
    let html = text?.trim() || getFallbackHTML(prompt);
    html = html.replace(/^```(?:html)?\s*/i, "").replace(/\s*```$/i, "");
    return html;
  } catch (error) {
    console.error("Error generating app design:", error);
    return getFallbackHTML(prompt);
  }
}

/** Simple fallback if AI generation fails */
function getFallbackHTML(prompt: string): string {
  return `
<div class="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col" style="font-family: 'Inter', sans-serif;">
  <!-- Status Bar -->
  <div class="flex items-center justify-between px-6 pt-3 pb-2 text-xs font-semibold text-gray-800">
    <span>9:41</span>
    <div class="flex items-center gap-1">
      <span>📶</span><span>🔋</span>
    </div>
  </div>

  <!-- Header -->
  <div class="px-6 pt-4 pb-6">
    <p class="text-xs text-indigo-500 font-semibold uppercase tracking-wider mb-1">Welcome</p>
    <h1 class="text-2xl font-bold text-gray-900">Your App</h1>
    <p class="text-sm text-gray-500 mt-1">${prompt}</p>
  </div>

  <!-- Main Card -->
  <div class="mx-6 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
    <div class="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl mb-4">🚀</div>
    <h2 class="text-lg font-bold text-gray-900 mb-2">Getting Started</h2>
    <p class="text-sm text-gray-500 leading-relaxed">
      This is your app design. Use the AI prompt to regenerate or refine this screen.
    </p>
    <button class="mt-4 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm py-3 rounded-xl transition-colors">
      Get Started
    </button>
  </div>

  <!-- Stats Row -->
  <div class="grid grid-cols-3 gap-3 mx-6 mt-6">
    <div class="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
      <p class="text-xl font-bold text-gray-900">12</p>
      <p class="text-xs text-gray-400 mt-1">Items</p>
    </div>
    <div class="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
      <p class="text-xl font-bold text-gray-900">4.8</p>
      <p class="text-xs text-gray-400 mt-1">Rating</p>
    </div>
    <div class="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
      <p class="text-xl font-bold text-gray-900">1.2k</p>
      <p class="text-xs text-gray-400 mt-1">Users</p>
    </div>
  </div>

  <!-- Spacer -->
  <div class="flex-1"></div>

  <!-- Bottom Navigation -->
  <div class="flex items-center justify-around py-4 px-6 border-t border-gray-100 bg-white">
    <div class="flex flex-col items-center gap-1 text-indigo-500">
      <span class="text-lg">🏠</span>
      <span class="text-[10px] font-semibold">Home</span>
    </div>
    <div class="flex flex-col items-center gap-1 text-gray-400">
      <span class="text-lg">🔍</span>
      <span class="text-[10px] font-medium">Search</span>
    </div>
    <div class="flex flex-col items-center gap-1 text-gray-400">
      <span class="text-lg">❤️</span>
      <span class="text-[10px] font-medium">Favorites</span>
    </div>
    <div class="flex flex-col items-center gap-1 text-gray-400">
      <span class="text-lg">👤</span>
      <span class="text-[10px] font-medium">Profile</span>
    </div>
  </div>
</div>`;
}
