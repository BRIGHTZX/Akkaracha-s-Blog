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
  return (
    <div className="md:hidden flex items-center">
      <Sheet>
        <SheetTrigger>
          <FaBars />
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>MENU</SheetTitle>
            <SheetDescription>
              <div className="flex flex-col text-black font-bold text-xl">
                <Link to="/">Home</Link>
                <Link to="/">About</Link>
                <Link to="/">Project</Link>
                <Link to="/">Sign In</Link>
                <Link to="/">Sign Up</Link>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNav;
