export function getHTMLWrapper(
    html: string,
    title: "Untitled",
    theme_style?: string,
    frameId?: string
    ) {
        const finalTheme = theme_style || OCEAN_BREEZE_THEME;

    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="widthdevice-width, initial-scale=1" />
  <title>${title}</title>

  google font
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; width: 100%; }
    ${theme_style ?? ""}
  </style>
</head>
<body>
  ${html}
</body>
</html>
    `
}