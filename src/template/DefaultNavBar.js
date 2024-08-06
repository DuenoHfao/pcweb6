import { Navbar, Container, Nav } from "react-bootstrap";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export function HomeNavBar() {
    const [user] = useAuthState(auth);

    return (
        <Navbar variant="light" bg="light">
            <Container>
            <Navbar.Brand href="/">Tinkergram</Navbar.Brand>
            <Nav>
                <Nav.Link href="/add">New Post</Nav.Link>
                {!user && <Nav.Link href="/login">Login</Nav.Link>}
                {user && <Nav.Link onClick={(e) => signOut(auth)}>Sign Out</Nav.Link>}
            </Nav>
            </Container>
        </Navbar>
    );
}

export function LoginNavBar() {
    return (
        <Navbar variant="light" bg="light">
            <Container>
            <Navbar.Brand href="/">Tinkergram</Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export function NewPostNavBar() {
    return (
        <Navbar variant="light" bg="light">
            <Container>
            <Navbar.Brand href="/">Tinkergram</Navbar.Brand>
            <Nav>
                <Nav.Link onClick={(e) => signOut(auth)}>Sign Out</Nav.Link>
            </Nav>
            </Container>
        </Navbar>
    );
}

export function DetailNavBar() {
    return (
        <Navbar variant="light" bg="light">
            <Container>
            <Navbar.Brand href="/">Tinkergram</Navbar.Brand>
            <Nav>
                <Nav.Link href="/add" >New Post</Nav.Link>
                <Nav.Link onClick={(e) => signOut(auth)}>Sign Out</Nav.Link>
            </Nav>
            </Container>
        </Navbar>
    );
}