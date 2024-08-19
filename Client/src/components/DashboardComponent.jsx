import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

//icon
import { HiOutlineUserGroup } from "react-icons/hi";
import { HiArrowNarrowUp } from "react-icons/hi";
import { LiaCommentSolid } from "react-icons/lia";
import { BsFilePost } from "react-icons/bs";

export default function DashboardComponent() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios("/api/user/getusers?limit=5");
        const data = res.data;

        if (res.status >= 200 && res.status < 300) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await axios("/api/comment/getcomments?limit=5");
        const data = res.data;

        if (res.status >= 200 && res.status < 300) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await axios("/api/post/getposts?limit=5");
        const data = res.data;

        if (res.status >= 200 && res.status < 300) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchComments();
      fetchPosts();
    }
  }, [currentUser]);
  return (
    <>
      {/* section total */}
      <div className="flex justify-center flex-wrap">
        {/* --------------------------------------------- */}
        <div className="p-3 md:w-[350px] w-full">
          <div className="flex flex-col p-3 bg-secondary gap-4 w-full rounded-md shadow-md ">
            <div className="flex justify-between">
              <div>
                <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
                <p className="text-2xl">{totalUsers}</p>
              </div>
              <HiOutlineUserGroup className="bg-primary text-secondary rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiArrowNarrowUp />
                {lastMonthUsers}
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>
        </div>
        {/* --------------------------------------------- */}
        <div className="p-3  md:w-[350px] w-full">
          <div className="flex flex-col p-3 bg-secondary gap-4 w-full rounded-md shadow-md ">
            <div className="flex justify-between">
              <div>
                <h3 className="text-gray-500 text-md uppercase">
                  Total Comments
                </h3>
                <p className="text-2xl">{totalComments}</p>
              </div>
              <LiaCommentSolid className="bg-primary text-secondary rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiArrowNarrowUp />
                {lastMonthComments}
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>
        </div>
        {/* --------------------------------------------- */}
        <div className="p-3  md:w-[350px] w-full">
          <div className="flex flex-col p-3 bg-secondary gap-4 w-full rounded-md shadow-md ">
            <div className="flex justify-between">
              <div>
                <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
                <p className="text-2xl">{totalPosts}</p>
              </div>
              <BsFilePost className="bg-primary text-secondary rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiArrowNarrowUp />
                {lastMonthPosts}
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>
        </div>
      </div>

      {/* section show items */}
      <div>adslfjasd;lkfj</div>
    </>
  );
}
