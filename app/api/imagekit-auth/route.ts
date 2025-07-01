import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
      return Response.json(
        { error: "Missing env variables" },
        { status: 500 }
      );
    }

    const authenticationParameters = getUploadAuthParams({
      privateKey,
      publicKey,
    });

    return Response.json({ authenticationParameters, publicKey });
  } catch (error) {
    console.error("ImageKit Auth Error:", error);
    return Response.json(
      {
        error: "Authentication for imagekit failed",
      },
      {
        status: 500,
      }
    );
  }
}
