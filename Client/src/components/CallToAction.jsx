import { Button } from "./ui/button";

export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center p-3 border border-primary rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl">Want to learn more about JavaScript</h2>
        <p className="text-gray-500 my-2">
          Checkout these resources with 100 JavaScript Projects
        </p>
        <Button className="rounded-tl-xl rounded-bl-none">
          <a
            href="https://www.100jsprojects.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            100 JavaScript Projects
          </a>
        </Button>
      </div>
      <div className="flex-1 p-7">
        <img
          src="https://bairesdev.mo.cloudinary.net/blog/2023/08/What-Is-JavaScript-Used-For.jpg?tx=w_1920,q_auto"
          alt=""
        />
      </div>
    </div>
  );
}
