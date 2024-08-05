import { Link } from "react-router-dom";
import MaxWidthWrapper from "../MaxWidthWrapper";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";
import { useTheme } from "../ThemeProvider";
import { FaMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";
import { Toggle } from "@/components/ui/toggle";

function Header() {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

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
            <Toggle
              className="text-xl"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")} // สลับธีมระหว่าง 'light' และ 'dark'
            >
              {theme === "light" ? (
                <div>
                  <IoSunny /> {/* ไอคอนสำหรับโหมดสว่าง */}
                </div>
              ) : (
                <div>
                  <FaMoon /> {/* ไอคอนสำหรับโหมดมืด */}
                </div>
              )}
            </Toggle>

            <MainNav />

            <MobileNav />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default Header;
