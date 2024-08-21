/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FadeLoader from "react-spinners/ClipLoader";
import { Button } from "./ui/button";
import CallToAction from "./CallToAction";
import CommentSection from "./CommentSection";
import PostCard from "./PostCard";

function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.data;

        if (!(res.status >= 200 && res.status < 300)) {
          setError(true);
          setLoading(false);
        }

        if (res.status >= 200 && res.status < 300) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);

        console.log(error);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await axios(`/api/post/getposts?limit=3`);
        const data = res.data;
        if (res.status >= 200 && res.status < 300) {
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FadeLoader color="text-primary" />
      </div>
    );
  }
  return (
    <>
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          {post.title}
        </h1>
        <Link
          to={`/search?category=${post && post.category}`}
          className="self-center mt-5"
        >
          <Button className="rounded-full bg-secondary text-primary hover:text-secondary">
            {post && post.category}
          </Button>
        </Link>
        <img
          src={post && post.image}
          alt={post && post.title}
          className="mt-10 p-3 max-h-[600px] w-full object-cover"
        />
        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
          <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
          <span>
            {post && (post.content.length / 1000).toFixed(0)} mins read
          </span>
        </div>

        <div
          className="p-3 max-w-2xl mx-auto w-full post-content"
          dangerouslySetInnerHTML={{ __html: post && post.content }}
        >
          {/* Content */}
        </div>
        <div className="max-w-4xl mx-auto w-full">
          <CallToAction />
        </div>
        <CommentSection postId={post._id} />
      </main>
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent Articles</h1>
        <div className="flex flex-wrap gap-5 justify-center mt-5">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </>
  );
}

export default PostPage;
