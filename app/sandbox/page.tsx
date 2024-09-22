import ClientComponent from "@/components/editor/ClientComponent";
import { getUserData } from "@/lib/auth";
import { redirect } from "next/navigation";

const page = async () => {
  const userData = await getUserData();
  if (!userData) {
    // Redirect to login page
    redirect("/login");
  }
  const userId = userData && userData.id;
  console.log(userId);
  const fileList = await fetch(
    `http://localhost:8000/v1/create-files/list/${userId}`
  );
  const filesData = await fileList.json();
  console.log(filesData);
  return (
    <div className="w-full h-screen flex">
      <ClientComponent userId={userId} filesData={filesData} />
    </div>
  );
};

export default page;
