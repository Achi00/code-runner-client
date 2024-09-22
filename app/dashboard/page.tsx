import { redirect } from "next/navigation";
import { getUserData } from "@/lib/auth";

const page = async () => {
  const user = await getUserData();
  if (!user) {
    redirect("/login");
  }

  const { id, name, email } = user;

  return <div>{name}</div>;
};

export default page;
