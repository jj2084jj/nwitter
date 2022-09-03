import { useState } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";

const AppRouter = ({ isLoggedIn }) => {
  return (
    <Router>
      {isLoggedIn && <Navigation />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" exact element={<Home />} />
            <Route path="/profile" exact element={<Profile />} />
          </>
        ) : (
          <Route path="/" exact element={<Auth />} />
        )}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Router>
  );
};
export default AppRouter;
