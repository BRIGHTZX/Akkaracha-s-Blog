import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

//icon
import { HiOutlineUserGroup } from "react-icons/hi";
import { HiArrowNarrowUp } from "react-icons/hi";
import { LiaCommentSolid } from "react-icons/lia";
import { BsFilePost } from "react-icons/bs";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
              <span className="text-blue-500 flex items-center">
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
              <span className="text-blue-500 flex items-center">
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
              <span className="text-blue-500 flex items-center">
                <HiArrowNarrowUp />
                {lastMonthPosts}
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>
        </div>
      </div>

      {/* section show items */}
      <div className="flex justify-center flex-wrap gap-4">
        {/* Recent User */}
        <div className="flex flex-col w-full md:w-[400px] shadow-md p-2 rounded-md bg-secondary">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Users</h1>
            <Link to={`/Dashboard?tab=users`}>
              <Button>See all</Button>
            </Link>
          </div>
          <div>
            <Table>
              <TableHeader>
                <TableRow className="uppercase">
                  {/* Header */}
                  <TableHead className="w-[150px]">User Image</TableHead>
                  <TableHead className="w-[150px]">Username</TableHead>
                </TableRow>
              </TableHeader>
              {users &&
                users.map((user) => (
                  <TableBody key={user._id} className="divide-y">
                    <TableRow>
                      <TableCell>
                        <img
                          src={user.profilePicture}
                          alt=""
                          className="w-10 h-10 object-cover rounded-full bg-gray-500"
                        />
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                    </TableRow>
                  </TableBody>
                ))}
            </Table>
          </div>
        </div>
        {/* Recent Comments */}
        <div className="flex flex-col w-full md:w-[550px] shadow-md p-2 rounded-md bg-secondary">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Comments</h1>
            <Link to={`/Dashboard?tab=comments`}>
              <Button>See all</Button>
            </Link>
          </div>
          <div>
            <Table>
              <TableHeader>
                <TableRow className="uppercase">
                  {/* Header */}
                  <TableHead className="w-[600px]">Comment content</TableHead>
                  <TableHead className="w-[80px]">Likes</TableHead>
                </TableRow>
              </TableHeader>
              {comments &&
                comments.map((comment) => (
                  <TableBody
                    key={comment._id}
                    className="divide-y w-10 h-[55.97px]"
                  >
                    <TableRow>
                      <TableCell>
                        <p className="line-clamp-2">{comment.content}</p>
                      </TableCell>
                      <TableCell>{comment.numberOfLikes}</TableCell>
                    </TableRow>
                  </TableBody>
                ))}
            </Table>
          </div>
        </div>
        {/* Recent Posts */}
        <div className="flex flex-col w-full md:w-[750px] shadow-md p-2 rounded-md bg-secondary">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Posts</h1>
            <Link to={`/Dashboard?tab=posts`}>
              <Button>See all</Button>
            </Link>
          </div>
          <div>
            <Table>
              <TableHeader>
                <TableRow className="uppercase">
                  {/* Header */}
                  <TableHead className="w-24">Post Image</TableHead>
                  <TableHead className="w-96">Post Title</TableHead>
                  <TableHead className="w-28">Category</TableHead>
                </TableRow>
              </TableHeader>
              {posts &&
                posts.map((post) => (
                  <TableBody key={post._id} className="divide-y">
                    <TableRow>
                      <TableCell>
                        <img
                          src={post.image}
                          alt=""
                          className="w-14 h-10 object-cover rounded-md bg-gray-500"
                        />
                      </TableCell>
                      <TableCell>{post.title}</TableCell>
                      <TableCell>{post.category}</TableCell>
                    </TableRow>
                  </TableBody>
                ))}
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
