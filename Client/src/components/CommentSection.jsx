/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import axios from "axios";

import { Alert, AlertDescription } from "@/components/ui/alert";
import Comment from "./Comment";

// eslint-disable-next-line no-unused-vars
export default function CommentSection({ postId }) {
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);

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
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axios(`/api/comment/getPostComments/${postId}`);
        if (res.statusText === "OK") {
          const data = res.data;
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/SignIn");
        return;
      }

      const res = await axios.put(`/api/comment/likeComment/${commentId}`);

      if (res.statusText === "OK") {
        const data = res.data;
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
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
          className="border border-secondary p-3 rounded-md"
        >
          <Textarea
            placeholder="Add a comment..."
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment.content}
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
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1 ">
            <p>Comments</p>
            <div className="border-4 border-secondary py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
            />
          ))}
        </>
      )}
    </div>
  );
}
