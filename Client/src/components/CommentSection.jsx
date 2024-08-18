/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";
import axios from "axios";

import { Alert, AlertDescription } from "@/components/ui/alert";

// eslint-disable-next-line no-unused-vars
export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }

    try {
      const res = await axios.post(
        "/api/comment/create",
        {
          content: comment,
          postId: postId,
          userId: currentUser._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data;

      if (res.status >= 200 && res.status < 300) {
        setComment("");
        setCommentError(null);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-7 w-7 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={"/Dashboard?tab=profile"}
            className="text-sm text-cyan-500 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-primary my-5 flex gap-1">
          You must be sign in to comment.
          <Link to={"/SignIn"} className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-secondary p-3 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between mt-5">
            <p className="text-gray-500 text-sm">
              {200 - comment.length} characters remaining
            </p>
            <Button>Submit</Button>
          </div>
          {commentError && (
            <Alert variant="destructive" className="mt-5">
              <AlertDescription>{commentError}</AlertDescription>
            </Alert>
          )}
        </form>
      )}
    </div>
  );
}
