import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
export default function PostCard({ post }) {
  return (
    <div className="group relative w-full border border-primary hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post cover"
          className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
        />
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
        <span className="italic text-sm">{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className="z-10 bottom-[-200px] group-hover:bottom-0 absolute left-0 right-0 border border-primary text-primary hover:bg-primary hover:text-secondary transition-all duration-300 text-center rounded-md !rounded-tl-none m-2 py-2"
        >
          Read article
        </Link>
      </div>
    </div>
  );
}

PostCard.propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
    category: PropTypes.string,
  }),
};
