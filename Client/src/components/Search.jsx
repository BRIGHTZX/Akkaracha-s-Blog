import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import PostCard from "./PostCard";

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  console.log(sidebarData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm") || "";
    const sortFromUrl = urlParams.get("sort") || "desc";
    const categoryFromUrl = urlParams.get("category") || "";

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await axios(`/api/post/getposts?${searchQuery}`);

        if (!(res.status >= 200 && res.status < 300)) {
          setLoading(false);
          return;
        }
        if (res.status >= 200 && res.status < 300) {
          const data = await res.data;
          setPosts(data.posts);
          setLoading(false);
          if (data.posts.length === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === "searchTerm") {
      setSidebarData({
        ...sidebarData,
        searchTerm: value,
      });
    } else if (id === "sort" || id === "category") {
      setSidebarData({
        ...sidebarData,
        [id]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    setLoading(false);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    const res = await axios(`/api/post/getposts?${searchQuery}`);
    if (res.status >= 200 && res.status < 300) {
      const data = res.data;
      setPosts([...posts, ...data.posts]);
      setShowMore(data.posts.length === 9);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-secondar md:w-72 lg:w-auto">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term :
            </label>
            <Input
              id="searchTerm"
              placeholder="Search . . . "
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Sort :</label>
            <Select
              onValueChange={(value) =>
                handleChange({ target: { id: "sort", value } })
              }
              value={sidebarData.sort}
            >
              <SelectTrigger className="w-full sm:w-[250px] md:w-[350px]">
                <SelectValue placeholder="Select sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="font-bold">
                  <SelectLabel>Select sort</SelectLabel>
                  <SelectItem value="desc">Latest</SelectItem>
                  <SelectItem value="asc">Oldest</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Category :
            </label>
            <Select
              onValueChange={(value) =>
                handleChange({ target: { id: "category", value } })
              }
              value={sidebarData.category}
            >
              <SelectTrigger className="w-full sm:w-[250px] md:w-[350px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="font-bold">
                  <SelectLabel>Select a category</SelectLabel>
                  <SelectItem value={null}>Uncategory</SelectItem>
                  <SelectItem value="javascript">Javascript</SelectItem>
                  <SelectItem value="reactjs">React.js</SelectItem>
                  <SelectItem value="nextjs">Next.js</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Apply Filters</Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-primary p-3 mt-5">
          Post Results :
        </h1>
        <div className="p-7 flex flex-wrap justify-center gap-4">
          {!loading && posts.length === 0 && (
            <div>
              <p className="text-xl text-gray-500">No Posts Found</p>
            </div>
          )}
          {loading && (
            <div>
              <p className="text-xl text-gray-500">Loading...</p>
            </div>
          )}
          {!loading &&
            posts &&
            posts.map((post) => (
              <PostCard
                className="flex justify-center"
                key={post._id}
                post={post}
              />
            ))}
          {showMore && (
            <button
              className="text-blue-500 hover:underline p-7 w-full"
              onClick={handleShowMore}
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
