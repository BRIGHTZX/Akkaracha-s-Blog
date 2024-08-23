import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
function OnlyPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/SignIn" />
  );
}

export default OnlyPrivateRoute;