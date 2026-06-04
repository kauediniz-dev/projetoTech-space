import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import type { Post } from "../models/interfaces/Post";
import { collection, type DocumentData, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConection";
import { CollectionsFirebase } from "../models/enums/collectionsFirebase";
import Posts from "../components/Post";

function Feed() {
  const [postList, setPostList] = useState<Array<Post>>([]);

  const handleGetPost = async (): Promise<void> => {
    const postsArray: Array<DocumentData> = [];
    const postListCollection = collection(db, CollectionsFirebase.POSTS);

    await getDocs(postListCollection).then((response) => {
      if (response) {
        for (const post of response.docs) {
          postsArray.push(post.data());
        }

        setPostList(postsArray as Array<Post>);
      }
    });
  };

  useEffect(() => {
    void handleGetPost();
  }, []);

  return (
    <>
      <Navbar handleGetPost={handleGetPost} />
      <Posts posts={postList} />
    </>
  );
}

export default Feed;
