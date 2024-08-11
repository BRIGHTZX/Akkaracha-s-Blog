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
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <div className="kanit">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route element={<PrivateRoute />}>
              <Route path="/Dashboard" element={<Dashboard />} />
            </Route>
            <Route element={<OnlyPrivateRoute />}>
              <Route path="/Create-Post" element={<CreatePost />} />
            </Route>
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/SignUp" element={<SignUp />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
