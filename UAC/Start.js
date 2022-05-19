import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import React from "react";
import App from "./App";
import SideBar from "./pages/Sidebar";

function Start() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route exact path="/:dbName1/:dbName2" element={<SideBar />} />
      </Routes>
    </Router>
  );
}
export default Start; 