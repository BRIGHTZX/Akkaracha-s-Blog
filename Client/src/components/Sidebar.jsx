import { createContext, useContext, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// icon
import { BiArrowFromRight, BiArrowFromLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { RiLogoutBoxFill } from "react-icons/ri";
import axios from "axios";

import { useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";

const SidebarContext = createContext();

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      const res = await axios.post("/api/user/signout");

      console.log(res.data); // Debugging line

      if (res.status >= 200 && res.status < 300) {
        dispatch(signoutSuccess());
      } else {
        console.log("Signout failed:", res.data.message);
      }
    } catch (error) {
      console.log("Error during signout:", error.message);
    }
  };

  function openSidebar() {
    setExpanded((expanded) => !expanded);
  }

  return (
    <aside className={`z-10 ${expanded ? "w-56" : "w-16"}`}>
      <nav className="flex h-screen flex-col border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <p
            className={`font-bold overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
          >
            Dashboard
          </p>
          <button onClick={openSidebar} className="p-1.5 rounded-lg">
            {expanded ? <BiArrowFromRight /> : <BiArrowFromLeft />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            <Link href="/Dashboard?tab=profile">
              <SidebarItem icon={<CgProfile />} text="Profile" active alert />
            </Link>
            <Link href="#">
              <SidebarItem icon={<IoSettingsOutline />} text="Setting" />
            </Link>
            <hr />
            <SidebarItem
              icon={<RiLogoutBoxFill />}
              text="Signout"
              onClick={handleSignout} // Make sure this is a button element
            />
          </ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert, ...props }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      {...props}
      className={`group
            relative flex items-center py-2 px-3 my-1
            rounded-md cursor-pointer

            ${active ? "bg-gray-500/20 text-primary" : ""}
            hover:bg-gray-500/50
        `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-blue-600
                        ${expanded ? "" : "top-2"}
                    `}
        />
      )}

      {!expanded && (
        <div
          className={`
                       absolute left-full rounded-md px-2 py-1 ml-6
                        bg-primary text-secondary text-sm 
                        opacity-0 -translate-x-3 transition-all
                        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                    `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
SidebarItem.propTypes = {
  icon: PropTypes.node.isRequired, // ใช้ PropTypes.node เพราะ icon อาจเป็น JSX
  text: PropTypes.node.isRequired, // ใช้ PropTypes.node เพราะ text อาจเป็น JSX
  active: PropTypes.bool, // ใช้ PropTypes.bool แทน PropTypes.string
  alert: PropTypes.bool, // ใช้ PropTypes.bool แทน PropTypes.string
};
