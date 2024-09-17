import { cookies } from "next/headers";
import { decrypt } from "./encryption";

export function getUserData() {
  const cookieStore = cookies();
  const encryptedUserData = cookieStore.get("userData");

  if (!encryptedUserData) {
    return null;
  }

  try {
    const decryptedUserData = decrypt(encryptedUserData.value);
    return JSON.parse(decryptedUserData);
  } catch (error) {
    console.error("Error decrypting user data:", error);
    return null;
  }
}
