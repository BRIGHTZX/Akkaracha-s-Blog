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
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`/api/user/getusers`);

        const data = res.data;

        if (res.status >= 200 && res.status < 300) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;

    try {
      const res = await axios(`api/user/getusers?startIndex=${startIndex}`);

      const data = res.data;
      if (res.status >= 200 && res.status < 300) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await axios.delete(`/api/user/delete/${userIdToDelete}`);
      const data = res.data;
      if (res.status >= 200 && res.status < 300) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      {currentUser.isAdmin && users.length > 0 ? (
        <div className="lg:mx-12">
          <ScrollArea className="max-w-full overflow-x-auto rounded-md border">
            <Table className="min-w-[800px]">
              <TableHeader className="bg-secondary uppercase">
                <TableRow>
                  {/* Header */}
                  <TableHead className="w-[150px]">Date Created</TableHead>
                  <TableHead className="w-[150px]">User image</TableHead>
                  <TableHead className="w-[150px]">Username</TableHead>
                  <TableHead className="w-[150px]">Email</TableHead>
                  <TableHead className="w-[150px]">Admin</TableHead>
                  <TableHead className="w-[100px]">Delete</TableHead>
                </TableRow>
              </TableHeader>
              {users.map((user) => (
                <TableBody key={user._id} className="border border-secondary">
                  <TableRow>
                    <TableCell className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-10 h-10 rounded-full  object-cover bg-gray-500"
                      />
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <FaCheck className="text-green-600" />
                      ) : (
                        <IoClose className="text-xl text-red-600" />
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-red-500">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={() => setUserIdToDelete(user._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to delete this user ?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                If you want delete this user. Click Yes I&apos;m
                                sure
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteUser}
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

export default DashUsers;
