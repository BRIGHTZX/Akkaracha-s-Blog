/* eslint-disable react/prop-types */
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";

function Comment({ comment }) {
  const [user, setUser] = useState({});
  console.log(user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios(`/api/user/${comment.userId}`);
        const data = res.data;

        if (res.statusText === "OK") {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);
  return (
    <div className="flex p-4 border-b text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1 ">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className="text-gray-500 pb-2">{comment.content}</p>
      </div>
    </div>
  );
}

export default Comment;
