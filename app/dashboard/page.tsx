import { useUserContext } from "@/components/UserProvider";
import React from "react";
import { redirect } from "next/navigation";

const page = () => {
  const { user, loading } = useUserContext();
  if (!user) {
    redirect("/login");
  }

  return <div>Welcome to dashboard</div>;
};

export default page;
