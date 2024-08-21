/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// import axios from "axios";
//firebase
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// Redux
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import axios from "axios";
import { Link } from "react-router-dom";

function DashProfile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const formSchema = z.object({
    username: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: currentUser.username,
      email: currentUser.email,
      password: "",
    },
  });

  const dispatch = useDispatch();

  //State
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await axios.put(
        `/api/user/update/${currentUser._id}`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = res.data;
      console.log(formData);
      console.log(res);
      console.log(data);
      if (!(res.status >= 200 && res.status < 300)) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
        setFormData({});
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(`/api/user/delete/${currentUser._id}`);

      const data = res.data;

      if (!(res.status >= 200 && res.status < 300)) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignout = async () => {
    try {
      const res = await axios.post(`/api/user/signout`);

      const data = res.data;
      if (!(res.status >= 200 && res.status < 300)) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="w-full md:container my-4">
      <div className="rounded-lg shadow-lg bg-secondary text-primary py-10 md:py-12 px-6 ">
        <Form {...form}>
          <form className="space-y-2 flex flex-col" onSubmit={handleSubmit}>
            <h1 className="font-bold text-4xl text-center">Profile</h1>
            <div
              className="relative mx-auto"
              onClick={() => filePickerRef.current.click()}
            >
              {imageFileUploadProgress && (
                <CircularProgressbar
                  value={imageFileUploadProgress || 0}
                  text={`${imageFileUploadProgress}%`}
                  strokeWidth={5}
                  styles={{
                    root: {
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: "0",
                      left: "0",
                    },
                    path: {
                      stroke: `rgba(62,152,199, ${
                        imageFileUploadProgress / 100
                      })`,
                    },
                  }}
                />
              )}
              <img
                src={imageFileUrl || currentUser.profilePicture}
                className={`h-32 w-32 border-4 border-gray-50 rounded-full object-cover text-center ${
                  imageFileUploadProgress && imageFileUploadProgress < 100
                    ? "opacity-50"
                    : ""
                }`}
                alt=""
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={filePickerRef}
                hidden
              />
            </div>
            {imageFileUploadError && (
              <div className="my-4 w-auto mx-auto">
                <Alert variant="destructive">
                  <AlertDescription>{imageFileUploadError}</AlertDescription>
                </Alert>
              </div>
            )}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      id="username"
                      placeholder={currentUser.username}
                      className="border border-gray-300 rounded-md p-2"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e); // This calls React Hook Form's internal onChange
                        handleChange(e); // This is your custom onChange handler
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder={currentUser.email}
                      className="border border-gray-300 rounded-md p-2"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e); // This calls React Hook Form's internal onChange
                        handleChange(e); // This is your custom onChange handler
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      placeholder="Enter your Password"
                      className="border border-gray-300 rounded-md p-2"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e); // This calls React Hook Form's internal onChange
                        handleChange(e); // This is your custom onChange handler
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={loading || imageFileUploading}
              >
                {loading ? (
                  <>
                    <span className="pl-3">Loadding...</span>
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </form>
          {currentUser.isAdmin && (
            <Link to="/Create-Post">
              <Button className="w-full bg-purple-600 text-white mt-4">
                Create a Post
              </Button>
            </Link>
          )}
          <div className="flex justify-between mt-4">
            <div>
              <AlertDialog>
                <AlertDialogTrigger className="text-red-500 hover:text-red-700">
                  Delete Account
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete your account ?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-500 hover:bg-red-700"
                      onClick={handleDeleteUser}
                    >
                      Yes, I&apos;m sure
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div>
              <Button
                variant="destructive"
                className="w-40"
                onClick={handleSignout}
              >
                Sign out
              </Button>
            </div>
          </div>
        </Form>
      </div>
      <div>
        {updateUserError && (
          <div className="mt-4">
            <Alert className="border border-orange-500">
              <AlertDescription>{updateUserError}</AlertDescription>
            </Alert>
          </div>
        )}
        {error && (
          <div className="mt-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
        {updateUserSuccess && (
          <div className="mt-4">
            <Alert className="border border-green-500 ">
              <AlertDescription>{updateUserSuccess}</AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashProfile;
