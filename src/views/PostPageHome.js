import { useEffect, useState } from "react";
import { Container, Image, Row, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getDocs, collection } from "firebase/firestore";
import { dB } from "../firebase";
import { HomeNavBar } from "../template/DefaultNavBar";


export default function PostPageHome() {
  const [posts, setPosts] = useState([]);
  const [captionID, setCaptionID] = useState(null);
  
   async function getAllPosts() {
    const query = await getDocs(collection(dB, "posts"));
    const postList = query.docs.map((doc) => {
      return {id: doc.id, ...doc.data()};
    });
    setPosts(postList);
  }

  function ImageSquare({ post }) {
    const { image, id, caption } = post;
    return (
      <Link
        to={`post/${id}`}
        style={{
          width: "18rem",
          marginLeft: "1rem",
          marginTop: "2rem",
        }}
      >
        <Image
          src={image}
          id={id}
          style={{
            objectFit: "cover",
            width: "18rem",
            height: "18rem",
          }}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
        />
        {captionID === id && <div>{caption}</div>}
      </Link>
    );
  }
  
  function handleMouseOver(e) {
    setCaptionID(e.target.id);
  }

  function handleMouseLeave(e) {
    setCaptionID(null);
  }
  useEffect(() => {
    getAllPosts();
  }, []);

  const ImagesRow = () => {
    return posts.map((post, index) => <ImageSquare key={index} post={post} />);
  };

  return (
    <>
    <HomeNavBar />
      <Container>
        <Row>
          <ImagesRow />
        </Row>
      </Container>
      </>
  );
}

