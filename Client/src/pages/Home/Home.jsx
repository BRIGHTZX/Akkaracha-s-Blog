import CallToAction from "@/components/CallToAction";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import PostCard from "@/components/PostCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios("/api/post/getPosts");
        const data = res.data;
        setPosts(data.posts);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 lg:p-28 px-3 pb-3 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Here you&apos;ll find a varity of articles and tutorials on topics
          such as web development, software engineering, and programming
          languages.
        </p>
        <Link
          to="/Search"
          className="text-xs sm:text-sm text-blue-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>
      <div className="p-3 bg-secondary">
        <CallToAction />
      </div>
      <MaxWidthWrapper>
        <div className="p-3 flex flex-col gap-8 py-7">
          {posts && posts.length > 0 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold text-center">
                Recent Posts
              </h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              <Link
                to={`/Search`}
                className="text-lg text-blue hover:underline text-center"
              >
                View All Posts
              </Link>
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

export default Home;
