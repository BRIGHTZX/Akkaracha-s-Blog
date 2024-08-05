import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { signoutSuccess } from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function NavProfile({ id_user, imgSrc, username, email }) {
  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      const res = await axios.post("/api/user/signout");

      if (res.status >= 200 && res.status < 300) {
        dispatch(signoutSuccess());
        // Optionally, you can add a redirect or additional logic here
      } else {
        console.log(res.data.message); // Ensure the server returns a message in the response
      }
    } catch (error) {
      console.log("Error during sign out:", error.message);
    }
  };

  return (
    <DropdownMenu className="relative">
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <img
            src={imgSrc || "/default-avatar.png"} // Fallback to a default image if imgSrc is not provided
            className="w-8 h-8 rounded-full object-cover"
            alt={username || "User Avatar"}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuLabel>{username}</DropdownMenuLabel>
        <DropdownMenuLabel>{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to={`/Dashboard?tab=${id_user}`}>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
NavProfile.propTypes = {
  id_user: PropTypes.string.isRequired,
  imgSrc: PropTypes.string,
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

export default NavProfile;
