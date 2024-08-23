import { Button } from "./ui/button";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess, signInFailure } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Oauth() {
  const navigate = useNavigate(); // Correctly invoke useNavigate
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      // Send the Google sign-in result to your server
      const res = await axios.post(
        "/api/auth/google",
        {
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhoto: resultsFromGoogle.user.photoURL,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Directly use the response data
      const data = res.data;

      // Handle the server response
      if (res.status >= 200 && res.status < 300) {
        dispatch(signInSuccess(data));
        navigate("/"); // Redirect the user after a successful login
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      console.error("Google sign-in failed:", error);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full border border-secondary bg-primary text-secondary mt-4"
      onClick={handleGoogleClick}
    >
      <span className="text-2xl">
        <AiFillGoogleCircle />
      </span>
      Continue with Google
    </Button>
  );
}

export default Oauth;
