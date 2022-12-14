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

const AppRouter = ({ isLoggedIn, userObj, refreshUser }) => {
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj} />}
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route
                            path="/"
                            exact
                            element={<Home userObj={userObj} />}
                        />
                        <Route
                            path="/profile"
                            exact
                            element={
                                <Profile
                                    refreshUser={refreshUser}
                                    userObj={userObj}
                                />
                            }
                        />
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
