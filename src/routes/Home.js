import { useEffect, useInsertionEffect, useState } from "react";
import { dbService } from "../fbase";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");

    // 등록
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("nweets").add({
            text: nweet,
            createAt: Date.now(),
            creatorId: userObj.uid,
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

    const onFileChange = (event) => {
        event.preventDefault();
        const {
            target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();

        reader.onloadend = (finishedEvent) => {
            //onloadend는 결과가 바뀌고 난 뒤 감지를 시켜준다
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };
        //파일 정보를 인자로 받아서 경로를 반환해준다
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment("");

    useEffect(() => {
        dbService.collection("nweets").onSnapshot((snapshop) => {
            const newArray = snapshop.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setNweets(newArray);
        });
    }, []);

    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="입력"
                    maxLength={120}
                />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Nweet" />
                {attachment && (
                    <>
                        <img src={attachment} width="50px" height="50px"></img>
                        <button onClick={onClearAttachment}>삭제</button>
                    </>
                )}
            </form>
            <div>
                {nweets.map((nweet) => (
                    <Nweet
                        key={nweet.id}
                        nweetObj={nweet}
                        isOwner={nweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </>
    );
};

export default Home;
