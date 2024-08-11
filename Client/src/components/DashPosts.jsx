import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// components
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  console.log(userPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `/api/post/getposts?userId=${currentUser._id}`
        );

        const data = res.data;

        if (res.status >= 200 && res.status < 300) {
          setUserPosts(data.posts);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  return (
    <div>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <div>
          <ScrollArea className="whitespace-nowrap rounded-md border">
            <Table className="">
              <TableHeader className="bg-secondary">
                <TableRow>
                  {/* Header */}
                  <TableHead className="w-[150px]">Date updated</TableHead>
                  <TableHead className="w-[200px]">Post image</TableHead>
                  <TableHead className="w-[150px]">Post title</TableHead>
                  <TableHead className="w-[150px]">Category</TableHead>
                  <TableHead className="w-[100px]">Delete</TableHead>
                  <TableHead className="w-[100px]">
                    <span>Edit</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              {userPosts.map((post) => (
                <TableBody key={userPosts._id}>
                  <TableRow>
                    <TableCell className="font-medium">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Link to={`/post/${post.slug}`}>
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-20 h-10 object-cover bg-gray-500"
                        />
                      </Link>
                    </TableCell>
                    <TableCell className="font-bold">
                      <Link to={`/post/${post.slug}`}>{post.title}</Link>
                    </TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>
                      <span>Delete</span>
                    </TableCell>
                    <TableCell>
                      <Link to={`/update-post/${post._id}`}>
                        <span>Edit</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      ) : null}
    </div>
  );
}

export default DashPosts;
