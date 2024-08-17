import { Link } from "react-router-dom";
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
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [postIdToDelete, setPostIdToDelete] = useState("");
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
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    try {
      const res = await axios.delete(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`
      );
      console.log(res);
      const data = res.data;

      if (!(res.status >= 200 && res.status < 300)) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.error("Failed to delete the post:", error);
    }
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
                      <span className="text-red-500">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={() => setPostIdToDelete(post._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to delete this post ?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                If you want delete this post. Click Yes I&apos;m
                                sure
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeletePost}
                                className="bg-red-500 text-white"
                              >
                                Yes, I&apos;m sure
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link to={`/Update-Post/${post._id}`}>
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
            >
              Show more
            </Button>
          )}
        </div>
      ) : (
        <div>You have no posts yet!</div>
      )}
    </div>
  );
}

export default DashPosts;
