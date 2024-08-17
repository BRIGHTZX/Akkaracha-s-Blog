import DashPosts from "@/components/DashPosts";
import DashProfile from "@/components/DashProfile";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex">
      <div>
        {/* Sidebar */}
        <Sidebar />
      </div>
      {/* Profile */}
      {tab === "profile" && <DashProfile />}
      {/* Posts */}
      {tab === "posts" && (
        <div className="w-full  border-4 border-red-500">
          <DashPosts />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
