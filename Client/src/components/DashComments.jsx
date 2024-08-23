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

function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/api/comment/getcomments`);

        const data = res.data;

        if (res.status >= 200 && res.status < 300) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;

    try {
      const res = await axios(
        `api/comment/getcomments?startIndex=${startIndex}`
      );

      const data = res.data;
      if (res.status >= 200 && res.status < 300) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async () => {
    try {
      const res = await axios.delete(
        `/api/comment/deleteComment/${commentIdToDelete}`
      );
      const data = res.data;
      if (res.status >= 200 && res.status < 300) {
        setComments((prev) =>
          prev.filter((comments) => comments._id !== commentIdToDelete)
        );
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      {currentUser.isAdmin && comments.length > 0 ? (
        <div className="lg:mx-12">
          <ScrollArea className="max-w-full overflow-x-auto rounded-md border">
            <Table className="min-w-[800px]">
              <TableHeader className="bg-secondary uppercase">
                <TableRow>
                  {/* Header */}
                  <TableHead className="w-[150px]">Date Updated</TableHead>
                  <TableHead className="w-[150px]">Comment content</TableHead>
                  <TableHead className="w-[150px]">Number of likes</TableHead>
                  <TableHead className="w-[150px]">PostId</TableHead>
                  <TableHead className="w-[150px]">UserId</TableHead>
                  <TableHead className="w-[100px]">Delete</TableHead>
                </TableRow>
              </TableHeader>
              {comments.map((comment) => (
                <TableBody
                  key={comment._id}
                  className="border border-secondary h-[100px]"
                >
                  <TableRow>
                    <TableCell className="font-medium">
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{comment.content}</TableCell>
                    <TableCell>{comment.numberOfLikes}</TableCell>
                    <TableCell>{comment.postId}</TableCell>
                    <TableCell>{comment.userId}</TableCell>
                    <TableCell>
                      <span className="text-red-500">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={() => setCommentIdToDelete(comment._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to delete this comment ?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                If you want delete this comment. Click Yes
                                I&apos;m sure
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteComment}
                                className="bg-red-500 text-white"
                              >
                                Yes, I&apos;m sure
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </span>
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

export default DashComments;
