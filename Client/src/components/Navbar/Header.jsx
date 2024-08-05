import { Link } from "react-router-dom";
// import MobileNav from "./MobileNav";
import MaxWidthWrapper from "../MaxWidthWrapper";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";
// import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
// import { Toggle } from "@/components/ui/toggle";
// import MainNav from "./MainNav";

function Header() {
  return (
    <nav className="sticky border-b">
      <MaxWidthWrapper>
        <div className="h-14 flex items-center justify-between">
          <Link to="/">
            <div className="font-bold">
              <span className="p-2 rounded-lg bg-primary text-secondary">
                Akkarcha&apos;s
              </span>{" "}
              Blog
            </div>
          </Link>

          <div className="flex">
            <MainNav />

            <MobileNav />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default Header;
