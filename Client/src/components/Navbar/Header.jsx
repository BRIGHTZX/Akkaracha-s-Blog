import { Link, useLocation, useNavigate } from "react-router-dom";
import MaxWidthWrapper from "../MaxWidthWrapper";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";
import { useTheme } from "../ThemeProvider";
import { FaMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "../ui/input";
import { IoMdSearch } from "react-icons/io";
import { useEffect, useState } from "react";

function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();

  const { theme, setTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const urlParms = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParms.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParms = new URLSearchParams(location.search);
    urlParms.set("searchTerm", searchTerm);
    const searchQuery = urlParms.toString();
    navigate(`/search?${searchQuery}`);
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

          <div className="relative hidden sm:block bg-secondary">
            <form onSubmit={handleSubmit}>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search . . . "
                className="w-48 h-8 focus:w-56 transition-all"
              />
              <IoMdSearch className="absolute top-2 right-2" />
            </form>
          </div>

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
