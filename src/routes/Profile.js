import { authService } from "../fbase";
import { useState } from "react";

import { getAuth, updateProfile } from "firebase/auth";

const Profile = ({ userObj, refreshUser }) => {
    const onLogOutClick = () => authService.signOut();
    const auth = getAuth();
    const [newDisplayName, setNewDisplayName] = useState(
        userObj.newDisplayName
    );

    // const getMyNweets = async () => {
    //     const nweets = await dbService
    //         .collection("nweets")
    //         .where("creatorId", "==", userObj.uid)
    //         .orderBy("createAt", "asc")
    //         .get();

    //     console.log(nweets.docs.map((doc) => doc.data()));
    // };

    // useEffect(() => {
    //     getMyNweets();
    // }, []);

    const onChnage = (event) => {
        const {
            target: { value },
        } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();

        if (userObj.newDisplayName !== newDisplayName) {
            await updateProfile(auth.currentUser, {
                displayName: newDisplayName,
            });
        }
        refreshUser();
    };
    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    onChange={onChnage}
                    type="text"
                    placeholder="Display name"
                    value={newDisplayName}
                />
                <input type="submit" value="update name" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};

export default Profile;
