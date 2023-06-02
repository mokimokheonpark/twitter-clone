import React, { useState, useEffect } from "react";
import { query, collection, orderBy, onSnapshot } from "firebase/firestore";
import { dbService } from "fbase";
import Tweet from "components/Tweet";
import TweetFactory from "components/TweetFactory";

const Home = ({ userObject }) => {
  const [tweets, setTweets] = useState([]);
  useEffect(() => {
    const q = query(
      collection(dbService, "tweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const tweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArr);
    });
  }, []);

  return (
    <div>
      <TweetFactory userObject={userObject} />
      <div>
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            tweetObject={tweet}
            isOwner={tweet.creatorId === userObject.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
