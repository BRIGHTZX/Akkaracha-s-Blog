import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import NavProfile from "./NavProfile";

function MainNav() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="hidden md:flex">
      <nav className="flex items-center gap-3 lg:gap-4 ml-2">
        <Link to="/">Home</Link>
        <Link to="/About">About</Link>
        <Link to="/Project">Project</Link>
        {currentUser ? (
          <div className="hidden md:block">
            <NavProfile
              imgSrc={currentUser.profilePicture}
              username={currentUser.username}
              email={currentUser.email}
            />
          </div>
        ) : (
          <Link to={`/SignIn`}>
            <Button
              variant="outline"
              className="border border-black hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black dark:border-white"
            >
              Sign In
            </Button>
          </Link>
        )}
      </nav>
    </div>
  );
}

export default MainNav;
