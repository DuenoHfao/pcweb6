import React, { useEffect, useState } from "react";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import { NewPostNavBar } from "../template/DefaultNavBar";
import { addDoc, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, dB, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


export default function PostPageAdd() {
    const [user, loading] = useAuthState(auth);
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState("");
    const navigate = useNavigate();

    async function addPost() {
        const imageRef = ref(storage, `image/${image.name}`);
        const response = await uploadBytes(imageRef, image);
        const imageURL = await getDownloadURL(response.ref);
        await addDoc(collection(dB, "posts"), {caption, image: imageURL});
        navigate("/");
    }

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
    }, [navigate, user, loading]);

    return (
    <>
        <NewPostNavBar />
        <Container>
        <h1 style={{ marginBlock: "1rem" }}>Add Post</h1>
        <Form>
            <Form.Group className="mb-3" controlId="caption">
            <Form.Label>Caption</Form.Label>
            <Form.Control
                type="text"
                placeholder="Lovely day"
                value={caption}
                onChange={(text) => setCaption(text.target.value)}
            />
            </Form.Group>

            <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
                type="file"
                onChange={(e) => {setImage(e.target.files[0])}}
            />
            <Form.Text className="text-muted">
                Make sure the url has a image type at the end: jpg, jpeg, png.
            </Form.Text>
            </Form.Group>
            <Button variant="primary" onClick={async (e) => addPost()}>
            Submit
            </Button>
        </Form>
        </Container>
    </>
    );
}