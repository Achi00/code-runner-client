import { cookies } from "next/headers";
import { decrypt } from "./encryption";

export async function getUserData() {
  const cookieStore = cookies();
  const encryptedUserData = cookieStore.get("userData");

  if (!encryptedUserData) {
    return null;
  }

  try {
    const response = await fetch("http://localhost:3000/api/userdata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ encryptedData: encryptedUserData.value }),
    });
    if (response.ok) {
      const { userData } = await response.json();
      return userData;
    } else {
      console.error("Failed to decrypt user data");
      return null;
    }
  } catch (error) {
    console.error("Error decrypting user data:", error);
    return null;
  }
}
