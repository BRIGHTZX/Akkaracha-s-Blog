import MaxWidthWrapper from "./MaxWidthWrapper";

// icon
import { FaFacebook } from "react-icons/fa";
import { FaLine } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border border-t-2 text-center md:text-left">
      <MaxWidthWrapper>
        <div className="mt-8 md:hidden">
          <Link to="/">
            <div className="font-bold">
              <span className="rounded-lg p-2 bg-black text-white   dark:bg-white dark:text-black ">
                Akkaracha&qpos;s
              </span>{" "}
              Blog
            </div>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-8 mt-4 md:grid-cols-2 lg:grid-cols-3">
          {/* About  */}
          <section>
            <h1 className="font-bold">About Us</h1>
            <div className="mt-4">
              <p>Owner : Akkaracha Suttilow</p>
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
          </section>
          {/* Contact  */}
          <section>
            <h1 className="font-bold">FOLLOW US</h1>
            <div className="mt-4">
              <p>
                <a to="#">Github</a>
              </p>
              <p>
                <a to="#">Discord</a>
              </p>
            </div>
          </section>
          {/* About  */}
          <section>
            <h1 className="font-bold">LEGAL</h1>
            <div className="mt-4">
              <p>Pravacy Policy</p>
              <p>Terms & Conditions</p>
            </div>
          </section>
        </div>
        {/* End footer */}
        <footer className="py-4">
          <div className="flex items-center justify-between flex-col sm:flex-row border-t py-4">
            <span>
              {"©"} {new Date().getFullYear()}
            </span>
            <div className="flex items-center text-3xl space-x-4 mt-4 sm:mt-0">
              <Link to="/">
                <FaFacebook />
              </Link>
              <Link to="/">
                <FaLine />
              </Link>
              <Link to="/">
                <FaTwitter />
              </Link>
              <Link to="/">
                <FaGithub />
              </Link>
              <Link to="/">
                <FaDiscord />
              </Link>
            </div>
          </div>
        </footer>
      </MaxWidthWrapper>
    </footer>
  );
}

export default Footer;
