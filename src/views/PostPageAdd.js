import React, { useEffect, useState } from "react";
import { Button, Container, Form, Image, Row } from "react-bootstrap";
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
    const [previewImage, setPreviewImage] = useState("https://fastly.picsum.photos/id/69/420/420.jpg?hmac=mpGXwWum8-NPH-WF0d7SrqpJdQmiekTbQW9Rm6HPspk");
    const [displayPreview, setDisplayPreview] = useState(true);

    async function addPost() {
        const imageRef = ref(storage, `image/${image.name}`);
        const response = await uploadBytes(imageRef, image);
        const imageURL = await getDownloadURL(response.ref);
        await addDoc(collection(dB, "posts"), {caption, image: imageURL});
        navigate("/");
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
                onChange={handleUpload}
            />
            <Form.Text className="text-muted">
                Make sure the url has a image type at the end: jpg, jpeg, png, webp.
            </Form.Text>
            <Row>
                {displayPreview && <Image src={previewImage}
                style={{
                    objectFit: "cover",
                    width: "18rem",
                    height: "18rem",
                    display: "block"
                }}></Image>}
                {!displayPreview && <div>Upload a valid file format.</div>}
            </Row>
            </Form.Group>
            <Button variant="primary" onClick={async (e) => addPost()}>
            Submit
            </Button>
        </Form>
        </Container>
    </>
    );
}