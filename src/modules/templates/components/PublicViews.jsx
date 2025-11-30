import React from "react";
import Navbar from "../../shared/components/Navbar";
import { Outlet } from "react-router-dom";

const PublicViews = () => {
  return (
    <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default PublicViews;
