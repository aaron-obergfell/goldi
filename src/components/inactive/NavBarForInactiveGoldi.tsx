import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import full_logo from '../../full_logo.png'

export default function NavBarForInactiveGoldi() {

  return (
    <Navbar expand="lg">
      <Container>
        <Navbar.Brand href="#home">
          <img
            src={full_logo}
            height="80"
            className="d-inline-block align-top"
            alt="Goldi logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Button variant="outline-dark">Install</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}