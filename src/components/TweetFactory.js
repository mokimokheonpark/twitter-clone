import React, { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { dbService, storageService } from "fbase";

const TweetFactory = ({ userObject }) => {
  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const fileInput = useRef();
  const onClearAttachment = () => {
    setAttachment("");
    fileInput.current.value = null;
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(
        storageService,
        `${userObject.uid}/${uuidv4()}`
      );
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const tweetObject = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObject.uid,
      attachmentUrl,
    };
    try {
      const docRef = await addDoc(collection(dbService, "tweets"), tweetObject);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.log("Error adding document: ", error);
    }
    setTweet("");
    onClearAttachment();
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        value={tweet}
        onChange={onChange}
        type="text"
        placeholder="What's on your mind?"
        maxLength={120}
      />
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        ref={fileInput}
      />
      <input type="submit" value="Tweet" />
      {attachment && (
        <div>
          <img src={attachment} alt="" width="50px" height="50px" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
    </form>
  );
};

export default TweetFactory;
