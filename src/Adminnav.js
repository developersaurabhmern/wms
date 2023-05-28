import React from "react";
//import { NavLink } from "react-router-dom";

const AdminnavBar = () => {
  return (
    <>
       {/* Navbar */}
       <nav className="main-header navbar navbar-expand navbar-white navbar-light admin-nav">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <a href="Admin" className="nav-link">Home</a>
          </li>
        </ul>
        {/* SEARCH FORM */}
     </nav>
      {/* /.navbar */}
    </>
  );
};

export default AdminnavBar;
