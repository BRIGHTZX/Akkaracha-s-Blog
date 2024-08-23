import DashboardComponent from "@/components/DashboardComponent";
import DashComments from "@/components/DashComments";
import DashPosts from "@/components/DashPosts";
import DashProfile from "@/components/DashProfile";
import DashUsers from "@/components/DashUsers";
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
        <div className="w-full overflow-hidden">
          <DashPosts />
        </div>
      )}
      {/* Users */}
      {tab === "users" && (
        <div className="w-full overflow-hidden">
          <DashUsers />
        </div>
      )}
      {/* Comment */}
      {tab === "comments" && (
        <div className="w-full overflow-hidden">
          <DashComments />
        </div>
      )}
      {/* Dashboard Component */}
      {tab === "dash" && (
        <div className="w-full overflow-hidden">
          <DashboardComponent />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
