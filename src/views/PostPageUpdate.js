import React, { useEffect, useState } from "react";
import { Button, Container, Form, Image } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { DetailNavBar } from "../template/DefaultNavBar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, dB, storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


export default function PostPageUpdate() {
  const params = useParams();
  const id = params.id;
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("https://fastly.picsum.photos/id/69/420/420.jpg?hmac=mpGXwWum8-NPH-WF0d7SrqpJdQmiekTbQW9Rm6HPspk");
  const [user, loading] = useAuthState(auth);
  const [displayPreview, setDisplayPreview] = useState(true);
  const navigate = useNavigate();

  async function updatePost() {
    const imageRef = ref(storage, `images/${image.name}`);
    const response = await uploadBytes(imageRef, image);
    const imageURL = await getDownloadURL(response.ref);
    await updateDoc(doc(dB, "posts", id), {caption, image: imageURL});
    navigate("/");
  }

  async function getPost(id) {
    const PostDetails = await getDoc(doc(dB, "posts", id));
    const PostData = PostDetails.data();
    setCaption(PostData.caption);
    setImage(PostData.image);
    setPreviewImage(PostData.image);
  }

  function handleUpload(e) {
    const uploadedFile = e.target.files[0];

    if (checkAccepted(uploadedFile.name)) {
        setDisplayPreview(true);
        console.log("File format accepted!");
        setImage(uploadedFile);
        const ImagePreview = URL.createObjectURL(uploadedFile);
        setPreviewImage(ImagePreview);
    }
    else {
        setDisplayPreview(false);
    }
  }

  function checkAccepted(fileName) {
    const acceptedFormats = ['jpg', 'jpeg', 'png', 'webp'];
    let isAccepted = false;
    for (let i=0; i<acceptedFormats.length;i++) {
        isAccepted = isAccepted || fileName.slice(-4).includes(acceptedFormats[i]);
    }
    return isAccepted;
}

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    getPost(id);
  }, [id, loading, user, navigate]);

  return (
    <div>
      <DetailNavBar />
      <Container>
        <h1 style={{ marginBlock: "1rem" }}>Update Post</h1>
        <Form>
          <Form.Group className="mb-3" controlId="caption">
            <Form.Label>Caption</Form.Label>
            <Form.Control
              type="text"
              placeholder="Caption Text"
              value={caption}
              onChange={(text) => setCaption(text.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={handleUpload}
            />
            <Form.Text className="text-muted">
              Make sure the url has a image type at the end: jpg, jpeg, png.
            </Form.Text>
            <Image src={previewImage}
             style={{
              objectFit: "cover",
              width: "18rem",
              height: "18rem",
              display: "block"
          }}></Image>
          {!displayPreview && <div>Upload a valid file format.</div>}
          </Form.Group>
          <Button variant="primary" onClick={(e) => updatePost()}>
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
}