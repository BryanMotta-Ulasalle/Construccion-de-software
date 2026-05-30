import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Nav from "../components/my_ui/Nav";
import {UserProvider} from "../context/UserContext"

const DashboardLayout = () => {
  return (
    <UserProvider>
      <div className="flex flex-row ">
      <aside className="flex-2 h-screen p-4 bg-sidebar">
        <Nav />
      </aside>
      <main className="flex-13">
        <Outlet />
      </main>
    </div>
    </UserProvider>
  );
};

export default DashboardLayout;
