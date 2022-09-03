import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "../fbase";

function App() {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userObj, setUserObj] = useState(null);

    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                setIsLoggedIn(user.multiFactor.user);
                setUserObj(user.multiFactor.user);
                console.log(user.multiFactor.user.uid);
            } else {
                setIsLoggedIn(false);
            }
            setInit(true);
        });
        console.log("dd");
    }, []);
    return (
        <>
            {init ? (
                <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
            ) : (
                "initializing"
            )}
            <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
        </>
    );
    //텍스트 내부에 자바스크립트를 삽입하곳 싶은경우 중괄호를 해줘야한다
}

export default App;
