import ClientComponent from "@/components/editor/ClientComponent";
import { getUserData } from "@/lib/auth";
import { getPackages } from "@/lib/fetch";
import { redirect } from "next/navigation";

const page = async () => {
  const userData = await getUserData();
  if (!userData) {
    // Redirect to login page
    redirect("/login");
  }
  const userId = userData && userData.id;
  // fetch files list
  const fileList = await fetch(
    `http://localhost:8000/v1/create-files/list/${userId}`
  );
  const filesData = await fileList.json();
  // fetch dependencied
  let dependencies;
  if (userId) {
    dependencies = await getPackages(userId);
  }
  return (
    <div className="w-full h-screen flex">
      <ClientComponent
        userId={userId}
        filesData={filesData}
        dependencies={dependencies}
      />
    </div>
  );
};

export default page;
