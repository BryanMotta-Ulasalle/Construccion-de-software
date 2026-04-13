import React from "react";
import { Route, Routes } from "react-router-dom";
import Tasks from "../pages/Tasks";
import DashboardLayout from "../layout/DashboardLayout";
import Users from "../pages/Users";

const AppRouter = () => {
  return (
    <div>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Tasks />} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Routes>
    </div>
  );
};

export default AppRouter;
