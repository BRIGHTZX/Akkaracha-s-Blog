import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../../redux/user/userSlice";
import axios from "axios";
import { useState } from "react";

function MobileNav() {
  const { currentUser } = useSelector((state) => state.user);
  const [showSidebar, setShowSidebar] = useState(false);
  const dispatch = useDispatch();

  const descriptionId = "sheet-description";

  const handleSignOut = async () => {
    try {
      const res = await axios.post("/api/user/signout");

      if (res.status >= 200 && res.status < 300) {
        dispatch(signoutSuccess());
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleShowSidebar = () => {
    setShowSidebar(true);
  };

  const handleLinkClick = () => {
    setShowSidebar(false);
  };

  return (
    <div className="md:hidden flex items-center">
      <Sheet>
        <SheetTrigger aria-label="Open menu">
          <FaBars className="text-2xl" onClick={handleShowSidebar} />
        </SheetTrigger>
        {showSidebar && (
          <SheetContent side="right" aria-describedby={descriptionId}>
            <SheetHeader>
              <SheetTitle>
                <div className="font-bold mb-6 text-xl md:text-3xl">
                  <span className="p-2 rounded-lg bg-primary text-secondary">
                    Akkarcha&apos;s
                  </span>{" "}
                  Blog
                </div>
              </SheetTitle>
              <SheetDescription id={descriptionId}>
                <div>
                  <div>
                    {currentUser && (
                      <div className="flex flex-col items-center gap-4">
                        <img
                          src={currentUser.profilePicture}
                          alt={currentUser.username}
                          className="w-20 h-20 rounded-full"
                        />
                        <p className="text-lg text-primary font-semibold font-serif">
                          {currentUser.username}
                        </p>
                        <Link
                          to={`/Dashboard?tab=profile`}
                          onClick={handleLinkClick}
                        >
                          <Button className="border border-primary/50 w-16 h-8 rounded-full">
                            edit
                          </Button>
                        </Link>
                      </div>
                    )}
                    <div className="flex flex-col justify-between h-full text-black font-bold text-xl mt-4">
                      <div className="flex flex-col items-center">
                        <Link
                          to="/"
                          aria-label="Home"
                          onClick={handleLinkClick}
                        >
                          <div className="flex items-center justify-center py-2 p-20 rounded-lg hover:bg-secondary gap-2">
                            <p className="text-primary">Home</p>
                          </div>
                        </Link>
                        <Link
                          to="/About"
                          aria-label="About"
                          onClick={handleLinkClick}
                        >
                          <div className="flex items-center justify-center py-2 p-20 rounded-lg hover:bg-secondary gap-2">
                            <p className="text-primary">About</p>
                          </div>
                        </Link>
                        <Link
                          to="/Project"
                          aria-label="Project"
                          onClick={handleLinkClick}
                        >
                          <div className="flex items-center justify-center py-2 p-20 rounded-lg hover:bg-secondary gap-2">
                            <p className="text-primary">Project</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center mt-20 ">
                    {currentUser ? (
                      <Button
                        className="w-full"
                        onClick={() => {
                          handleSignOut();
                          handleLinkClick();
                        }}
                      >
                        Sign Out
                      </Button>
                    ) : (
                      <Link
                        to="/signin"
                        aria-label="Sign In"
                        onClick={handleLinkClick}
                        className="w-full"
                      >
                        <Button className="w-full bg-blue-600 hover:bg-blue-800 text-white">
                          Sign In
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        )}
      </Sheet>
    </div>
  );
}

export default MobileNav;
