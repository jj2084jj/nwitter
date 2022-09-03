import { useEffect, useState } from "react";
import { dbService } from "../fbase";

const Home = () => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);

    const getNeets = async () => {
        const dbNeets = await dbService.collection("nweets").get(); //스냅샵을 통해 데이터는 숨겨져있음

        dbNeets.forEach((document) =>
            setNweets((prev) => [document.data(), ...prev])
        );
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("nweets").add({
            text: nweet,
            createAt: Date.now(),
        });
        setNweet("");
    };

    const onChange = (event) => {
        event.preventDefault();
        const {
            target: { value },
        } = event;
        setNweet(value);
    };

    //
    useEffect(() => {
        getNeets();
    }, []);

    console.log(nweets);

    return (
        <form onSubmit={onSubmit}>
            <input
                value={nweet}
                onChange={onChange}
                type="text"
                placeholder="입력"
                maxLength={120}
            />
            <input type="submit" value="Nweet" />
        </form>
    );
};

export default Home;
