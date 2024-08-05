import { Button } from "./ui/button";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess, signInFailure } from "@/app/redux/user/userSlice";

function Oauth() {
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      //ใช่้จัดการการตอบกลับของฝั่ง server
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhoto: resultsFromGoogle.user.photoURL,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        router.push("../Home");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full border border-black bg-white text-black"
      onClick={handleGoogleClick} // Connect the handler to the button
    >
      <span className="text-2xl">
        <AiFillGoogleCircle />
      </span>
      Continue with Google
    </Button>
  );
}

export default Oauth;
