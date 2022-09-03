import { useEffect, useState } from "react";
import { dbService, storageService } from "../fbase";
import Nweet from "components/Nweet";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");

    // 등록
    const onSubmit = async (event) => {
        event.preventDefault();

        const attachmentUrl = "";

        if (attachmentUrl !== "") {
            //uuid 사용 (이미지와 db아이디 매칭)
            const attachmentRef = storageService
                .ref()
                .child(`${userObj.uid}/${uuidv4()}`);

            //putString = 해당 url인자를 전달하기만 하면 파일이 스토리지에 바로 저장된다
            const reponse = await attachmentRef.putString(
                attachment,
                "data_url"
            );

            //사진 불러오기 = response.ref.getDownloadURL 함수를 사용해서 불러올 수 있다.
            attachmentUrl = await reponse.ref.getDownloadURL();
        }

        await dbService.collection("nweets").add({
            text: nweet,
            createAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        });

        //초기화
        setNweet("");
        setAttachment("");
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
                        <img src={attachment} width="50px" height="50px" />
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
