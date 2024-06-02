import React from "react";
import logo from "./logo.svg";
import "./App.css";
import RepoList from "./Components/Repo/RepoList";
import Navbar from "./Components/Navbar/Navbar";

function App() {
  return (
    <div className="container">
      <Navbar />
      <div className="content">
        <RepoList />
      </div>
    </div>
  );
}

export default App;
