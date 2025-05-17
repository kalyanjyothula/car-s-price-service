import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { Header } from "./components/ui/header";
import Home from "./pages/Home";
import Report from "./pages/Report";

function App() {
  const headerLinks = [
    {
      title: "Home",
      link: "/",
      sublinksPresent: false,
    },
    {
      title: "Analysis Report",
      link: "/report",
      sublinksPresent: false,
    },
  ];

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Header title="Car Dekho" headerLinks={headerLinks} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </>
  );
}

export default App;
