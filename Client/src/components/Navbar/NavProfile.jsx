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

function NavProfile({ id_user, imgSrc, username, email }) {
  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      const res = await axios.post("/api/user/signout");

      const data = res.data;

      if (res.status >= 200 && res.status < 300) {
        dispatch(signoutSuccess());
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <DropdownMenu className="relative">
        <DropdownMenuTrigger asChild>
          <div className="relative">
            <img
              src={imgSrc}
              className="w-8 h-8 rounded-full object-cover"
              alt=""
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
    </>
  );
}

export default NavProfile;
