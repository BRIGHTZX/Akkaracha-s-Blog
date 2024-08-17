import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// components
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
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
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;

    try {
      const res = await axios(
        `api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );

      const data = res.data;
      if (res.status >= 200 && res.status < 300) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {}
  };

  return (
    <div>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <div className="lg:mx-12">
          <ScrollArea className="max-w-full overflow-x-auto rounded-md border">
            <Table className="min-w-[800px]">
              <TableHeader className="bg-secondary">
                <TableRow>
                  {/* Header */}
                  <TableHead className="w-[150px]">Date updated</TableHead>
                  <TableHead className="w-[150px]">Post image</TableHead>
                  <TableHead className="w-[150px]">Post title</TableHead>
                  <TableHead className="w-[150px]">Category</TableHead>
                  <TableHead className="w-[100px]">Delete</TableHead>
                  <TableHead className="w-[100px]">
                    <span>Edit</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              {userPosts.map((post) => (
                <TableBody key={post._id} className="border border-secondary">
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
                      <span className="text-red-500">Delete</span>
                    </TableCell>
                    <TableCell>
                      <Link to={`/update-post/${post._id}`}>
                        <span className="text-green-500">Edit</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                </TableBody>
              ))}
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          {showMore && (
            <Button
              onClick={handleShowMore}
              variant="ghost"
              className="w-full self-center py-7 text-sm"
              w-full
              text-primary
            >
              Show more
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default DashPosts;
