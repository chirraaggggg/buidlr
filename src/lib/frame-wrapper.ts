import { resolveThemeStyle, BASE_VARIABLES } from "./themes";

export function getHTMLWrapper(
  html: string,
  title: string = "Untitled",
  theme_style?: string,
  frameId?: string
) {
  // Use the provided theme style or fallback to the generic "ocean" theme
  const finalTheme = theme_style || resolveThemeStyle("ocean");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; width: 100%; min-height: 100vh; }
    
    /* Ensure default font applies */
    body { font-family: "Inter", sans-serif; }

    /* Base Variables (already included in resolveThemeStyle, but kept for completeness if needed) */
    /* ${BASE_VARIABLES} */
    
    /* Inject Theme Styles (variables + CSS) */
    ${finalTheme}
  </style>
</head>
<body data-frame-id="${frameId ?? ""}">
  ${html}
</body>
</html>`;
}