import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
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
} from "../redux/user/userSlice";

function DashProfile() {
  const {
    currentUser,
    loading,
    error: errorMessage,
  } = useSelector((state) => state.user);
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
  const filePickerRef = useRef(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState("");
  const [updateUserError, setUpdateUserError] = useState(null);
  const [formData, setFormData] = useState({});
  console.log("Current user:", currentUser);
  //Functional
  //Controller Form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // Image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resourece.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches("image/.*")
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
        setImageFileUploading(false); // ทำการตั้งค่านี้เพื่อให้ loading กลับไปที่ false
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No change made");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
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

      if (res.status >= 200 && res.status < 300) {
        setUpdateUserSuccess("User's Profile updated successfully");
        dispatch(updateSuccess(data));
      } else {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      }
    } catch (error) {
      dispatch(
        updateFailure(
          error.response ? error.response.data.message : error.message
        )
      );
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  return (
    <div className="w-full md:container p-4">
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
                className="w-full bg-blue-600 text-white mt-4"
                disabled={loading}
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
            <div className="flex justify-between">
              <Button>Delete Account</Button>
              <Button>Sign Out</Button>
            </div>
          </form>
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
        {errorMessage && (
          <div className="mt-4">
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
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
