// lib/uploadGeneratedAvatar.ts
import { upload } from "@imagekit/next";
import { generateAvatar } from "./avatar"; 

export const uploadGeneratedAvatar = async (username: string) => {
  const avatarFile = await generateAvatar(username);

  const authRes = await fetch("/api/imagekit-auth");
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

  return response;
};
