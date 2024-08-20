import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Header from "./components/Navbar/Header";
import Footer from "./components/Footer";
import About from "./pages/About/About";
import { ThemeProvider } from "./components/ThemeProvider";
import PrivateRoute from "./components/PrivateRoute";
import OnlyPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePost from "./pages/CreatePost/CreatePost";
import UpdatePost from "./pages/UpdatePost/UpdatePost";
import PostPage from "./components/PostPage";
import { ScrollToTop } from "./components/ScrollToTop";
import Search from "./components/Search";
import Project from "./pages/Project/Project";
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <div className="kanit">
          <ScrollToTop />
          <Header />
          <Routes>
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/" element={<Home />} />
            <Route path="/Search" element={<Search />} />
            <Route path="/About" element={<About />} />
            <Route path="/Project" element={<Project />} />
            <Route element={<PrivateRoute />}>
              <Route path="/Dashboard" element={<Dashboard />} />
            </Route>
            <Route element={<OnlyPrivateRoute />}>
              <Route path="/Create-Post" element={<CreatePost />} />
              <Route path="/Update-Post/:postId" element={<UpdatePost />} />
            </Route>
            <Route path="/post/:postSlug" element={<PostPage />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
