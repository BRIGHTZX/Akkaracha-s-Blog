import { useState } from "react";
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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreatePost() {
  const [value, setValue] = useState("");
  return (
    <div className="h-screen md:container">
      <div className="text-center h-auto p-4 sm:my-4">
        <h1 className="text-5xl font-bold my-7">Crate a Post</h1>
        <form action="">
          <div className="flex flex-col gap-4">
            {/* section 1 */}
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
              <Input
                type="text"
                placeholder="Title"
                required
                id="title"
                className="flex-1"
              />
              <Select>
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
                />
              </div>
              <Button className="">Upload image</Button>
            </div>
            {/* section 3 */}

            <ReactQuill
              theme="snow"
              onChange={setValue}
              value={value}
              placeholder="Write something..."
              className="h-[500px] mb-12"
              required
            />

            <Button
              type="submit"
              className="font-bold text-2xl h-auto mt-2 hover:bg-gray-400"
            >
              Publish
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
