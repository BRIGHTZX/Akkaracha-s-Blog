import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../../firebase";
// component
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadPrograss] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(null);

  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);

      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadPrograss(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadPrograss(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((dowloadURL) => {
            setImageUploadError(null);
            setImageUploadPrograss(null);
            setFormData({ ...formData, image: dowloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadPrograss(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPublishSuccess(null);
    setPublishError(null);
    try {
      const res = await axios.post("/api/post/create", formData);
      const data = await res.data;

      if (!(res.status >= 200 && res.status < 300)) {
        setPublishError(data.message || "Failed to publish");
      } else {
        setPublishError(null);
        setPublishSuccess("Success Publish");
        setFormData({});
        setTimeout(() => {
          navigate(`/Post/${res.data.slug}`);
        }, 1500); // 2 seconds delay
      }
    } catch (error) {
      setPublishError("Publish Falied");
    }
  };

  return (
    <div className="h-auto md:container">
      <div className="text-center h-auto p-4 sm:my-4">
        <h1 className="text-5xl font-bold my-7">Crate a Post</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {/* section 1 */}
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
              <Input
                type="text"
                placeholder="Title"
                required
                id="title"
                className="flex-1"
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                }}
              />
              <Select
                onValueChange={(value) => {
                  setFormData({ ...formData, category: value });
                }}
              >
                <SelectTrigger className="w-full sm:w-[250px] md:w-[350px] font-bold">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup className="font-bold">
                    <SelectLabel>Select a category</SelectLabel>
                    <SelectItem value="javascript">Javascript</SelectItem>
                    <SelectItem value="reactjs">React.js</SelectItem>
                    <SelectItem value="nextjs">Next.js</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/* section 2 */}
            <div className="flex gap-4 items-center justify-between border-4 border-primary border-dotted p-3">
              <div className="w-full">
                <Input
                  id="picture"
                  type="file"
                  accepts="image/*"
                  className="bg-white text-black"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <Button
                onClick={handleUploadImage}
                disabled={imageUploadProgress}
                className="h-auto"
              >
                {imageUploadProgress ? (
                  <div className="w-16 h-16">
                    <CircularProgressbar
                      value={imageUploadProgress}
                      text={`${imageUploadProgress || 0}%`}
                    ></CircularProgressbar>
                  </div>
                ) : (
                  "Upload Imgae"
                )}
              </Button>
            </div>
            {imageUploadError && (
              <Alert className="bg-red-500 text-white">
                <AlertDescription>{imageUploadError}</AlertDescription>
              </Alert>
            )}
            {formData.image && (
              <img
                src={`${formData.image}`}
                alt=""
                className="w-full h-72 object-cover"
              />
            )}
            {/* section 3 */}

            <ReactQuill
              theme="snow"
              placeholder="Write something..."
              className="h-[450px] mb-12"
              required
              onChange={(content) => {
                setFormData({ ...formData, content: content });
              }}
            />

            <Button
              type="submit"
              className="font-bold text-2xl h-auto mt-2 hover:bg-gray-400"
            >
              Publish
            </Button>
          </div>
          {publishError && (
            <Alert className="mt-4 bg-red-400 text-white">
              <AlertDescription>{publishError}</AlertDescription>
            </Alert>
          )}
          {publishSuccess && (
            <Alert className="mt-4 bg-green-400 text-white">
              <AlertDescription>{publishSuccess}</AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
