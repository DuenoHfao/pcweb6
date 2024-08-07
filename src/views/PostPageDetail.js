import { DetailNavBar } from "../template/DefaultNavBar";
import { useParams, useNavigate } from "react-router-dom";
import { dB, auth } from "../firebase";
import { getDoc, doc, deleteDoc, updateDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Container, Image, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";

export default function PostDetail() {
    
    const params = useParams();
    const id = params.id;
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState("");
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState("");
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    async function GetPost(id) {
        const queryRes = await getDoc(doc(dB, "posts", id));
        setImage(queryRes.data().image);
        setCaption(queryRes.data().caption);
        setLikes(queryRes.data().likes);
        console.log(likes);
    }

    async function deletePost() {
        await deleteDoc(doc(dB, "posts", id));
        navigate("/");
    }

    async function addLikes() {
        setLikes(likes + 1);
        await updateDoc(doc(dB, "posts", id), {likes: likes+1});
        console.log(likes);
    }

    async function addComment(e) {
        console.log(comments);
    }

    function MakePost() {

        return (
            <Container 
                style={{paddingTop:"2rem",
                    width: "50rem",
                    border: "1px solid #0c0c0c4b",
                    marginLeft: "auto",
                    marginRight: "auto",
                    borderRadius: "3rem",
                    padding: "2%",
                    boxShadow: "2px 4px 5px #0c0c0c4b"
                }}>
                    <Row xs={6}>
                        <Image
                            src={image}
                            id={id}
                            style={{
                                objectFit: "cover",
                                width: "auto",
                                maxWidth: "25rem",
                                height: "25rem",
                                marginLeft: "auto",
                                marginRight: "auto",
                                cursor: "pointer"
                            }}
                            onClick={addLikes}
                        />
                    </Row>
                    <Row
                        style={{
                            border: "1px solid #0000004b",
                            margin: "auto",
                            height: "10rem"
                    }}>
                        <Row>
                            <Col>
                                <Card.Text style={{
                                    textAlign: "center",
                                    fontFamily: "Georgia, serif",
                                    fontSize: "2.2em",
                                }}>{caption}</Card.Text>
                            </Col>
                            <Col>
                                <Card.Text>Likes: {likes}</Card.Text>
                            </Col>
                        </Row>
                        <Row>
                            <Col><Card.Link href={`/update/${id}`} style={{fontSize:"1.5em", textAlign: "center"}}>Edit</Card.Link></Col>
                            <Col><Card.Link onClick={deletePost} style={{fontSize:"1.5em", cursor: "pointer", textAlign: "center"}}>Delete</Card.Link></Col>
                        </Row>
                    </Row>
                    <Form>
                        <Row>
                            
                            <Form.Group>
                                <Form.Label>Comment</Form.Label>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Add comments"
                                        onChange={(e) => {}}
                                    />
                                </Col>
                                <Col>
                                <Button variant="primary" onClick={addComment}>Add Comment</Button>
                            </Col>
                            </Form.Group>
                            
                        </Row>
                        </Form>
            </Container>
        )
    }

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/login");
        GetPost(id);
    }, [id, navigate, user, loading])  
    

    return (
        <>
        <DetailNavBar />
        <Container style={{padding: '2%'}}>
                <MakePost /> 
        </Container>
        </>
    );
}