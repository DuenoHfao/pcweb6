import { DetailNavBar } from "../template/DefaultNavBar";
import { useParams, useNavigate } from "react-router-dom";
import { dB } from "../firebase";
import { collection, query, where, getDocs, getDoc, doc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Container, Image, Row, Col, Card } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";


export default function PostDetail() {
    
    const params = useParams();
    const id = params.id;
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState("");
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    async function GetPost(id) {
        const queryRes = await getDoc(doc(dB, "posts", id));
        setImage(queryRes.data().image);
        setCaption(queryRes.data().caption);
    }
    async function deletePost() {
        await deleteDoc(doc(dB, "posts", id));
        navigate("/");
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
                                marginRight: "auto"
                            }}
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
                        </Row>
                        <Row>
                            <Col><Card.Link href={`/update/${id}`} style={{fontSize:"1.5em", textAlign: "center"}}>Edit</Card.Link></Col>
                            <Col><Card.Link onClick={deletePost} style={{fontSize:"1.5em", cursor: "pointer", textAlign: "center"}}>Delete</Card.Link></Col>
                        </Row>
                    </Row>
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
        <Container>
            <Row>
                <MakePost /> 
            </Row>
        </Container>
        </>
    );
}