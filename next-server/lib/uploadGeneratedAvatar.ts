// lib/uploadGeneratedAvatar.ts
import { upload } from "@imagekit/next";
import { generateAvatar } from "./avatar";

export const uploadGeneratedAvatar = async (username: string) => {
  try {
    const avatarFile = await generateAvatar(username);
    // console.log(avatarFile)

    const authRes = await fetch("/api/imagekit-auth");
    // console.log(authRes)
    if (!authRes.ok) {
      const text = await authRes.text(); // get the HTML response body for debugging
      console.error("Failed to fetch /api/imagekit-auth:", text);
      throw new Error("Failed to fetch imagekit auth");
    }

    const contentType = authRes.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await authRes.text(); // Again, log for debugging
      console.error("Expected JSON but received:", text);
      throw new Error("Invalid response type from imagekit auth");
    }
    const auth = await authRes.json();

    if (!auth?.authenticationParameters || !auth?.publicKey) {
      throw new Error("Missing ImageKit authentication parameters");
    }

    const response = await upload({
      file: avatarFile,
      fileName: avatarFile.name,
      publicKey: auth.publicKey,
      signature: auth.authenticationParameters.signature,
      expire: auth.authenticationParameters.expire,
      token: auth.authenticationParameters.token,
    });
    // console.log(response)

    return response;
  } catch (error) {
    console.log(error)
  }
};
