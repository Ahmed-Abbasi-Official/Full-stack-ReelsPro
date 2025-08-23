// lib/generateInitialAvatar.ts
export async function generateAvatar(username: string): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const size = 200;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d")!;
    const firstLetter = username.charAt(0).toUpperCase();

    // Generate background color based on username
    const bgColor = stringToColor(username);

    // Circle background
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Initial
    ctx.fillStyle = "white";
    ctx.font = "bold 100px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(firstLetter, size / 2, size / 2);

    canvas.toBlob((blob) => {
      const file = new File([blob!], `${username}_avatar.png`, {
        type: "image/png",
      });
      resolve(file);
    }, "image/png");
  });
}

// Helper: Convert string to color
function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = "#" + ((hash >> 24) & 0xff).toString(16).padStart(2, '0') +
                       ((hash >> 16) & 0xff).toString(16).padStart(2, '0') +
                       ((hash >> 8) & 0xff).toString(16).padStart(2, '0');
  return color.slice(0, 7); // ensure it's a valid 6-char hex
}
