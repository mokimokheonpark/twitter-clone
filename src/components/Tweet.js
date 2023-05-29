import React, { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { dbService, storageService } from "fbase";

const Tweet = ({ tweetObject, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObject.text);
  const textRef = doc(dbService, "tweets", `${tweetObject.id}`);
  const attachmentRef = ref(storageService, tweetObject.attachmentUrl);
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(textRef, {
      text: newTweet,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTweet(value);
  };
  const onDeleteClick = async () => {
    const confirmDeleting = window.confirm(
      "Are you sure you want to delete this tweet?"
    );
    if (confirmDeleting) {
      await deleteDoc(textRef);
      if (tweetObject.attachmentUrl !== "") {
        await deleteObject(attachmentRef);
      }
    }
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your tweet"
              value={newTweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="Update Tweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{tweetObject.text}</h4>
          {tweetObject.attachmentUrl && (
            <img
              src={tweetObject.attachmentUrl}
              alt=""
              width="50px"
              height="50px"
            />
          )}
          {isOwner && (
            <>
              <button onClick={toggleEditing}>Edit Tweet</button>
              <button onClick={onDeleteClick}>Delete Tweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
