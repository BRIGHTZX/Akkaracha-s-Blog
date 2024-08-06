import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

function MobileNav() {
  const descriptionId = "sheet-description"; // ID ที่จะใช้ในการเชื่อมโยงกับ aria-describedby

  return (
    <div className="md:hidden flex items-center">
      <Sheet>
        <SheetTrigger aria-label="Open menu">
          <FaBars className="text-2xl" />
        </SheetTrigger>
        <SheetContent side="right" aria-describedby={descriptionId}>
          <SheetHeader>
            <SheetTitle>MENU</SheetTitle>
            <SheetDescription id={descriptionId}>
              <div className="flex flex-col text-black font-bold text-xl space-y-4">
                <Link to="/" aria-label="Home">
                  Home
                </Link>
                <Link to="/about" aria-label="About">
                  About
                </Link>
                <Link to="/project" aria-label="Project">
                  Project
                </Link>
                <Link to="/signin" aria-label="Sign In">
                  Sign In
                </Link>
                <Link to="/signup" aria-label="Sign Up">
                  Sign Up
                </Link>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNav;
