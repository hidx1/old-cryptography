import React from "react";
import { Tab, Row, Col, Nav } from "react-bootstrap";

import Header from "./Header";
import Vigenere from "./Ciphers/Vigenere";
import FullVigenere from "./Ciphers/FullVigenere";
import ExtendedVigenere from "./Ciphers/ExtendedVigenere";
import Playfair from "./Ciphers/Playfair";

function App() {
  return (
    <div>
      <Header />
      <div className="content-fluid">
        <Tab.Container defaultActiveKey="standard-vigenere">
          <Row>
            <Col sm={2}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="standard-vigenere">
                    Standard Vigenere Cipher
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="full-vigenere">
                    Full Vigenere Cipher
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="extended-vigenere">
                    Extended Vigenere Cipher
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="playfair">Playfair Cipher</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="super">Super Encryption</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="affine">Affine Cipher</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="hill">Hill Cipher</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={10} className="content-center">
              <Tab.Content className="full-width">
                <Tab.Pane eventKey="standard-vigenere">
                  <Vigenere />
                </Tab.Pane>
                <Tab.Pane eventKey="full-vigenere">
                  <FullVigenere />
                </Tab.Pane>
                <Tab.Pane eventKey="full-vigenere">Full Vigenere</Tab.Pane>
                <Tab.Pane eventKey="extended-vigenere">
                  <ExtendedVigenere />
                </Tab.Pane>
                <Tab.Pane eventKey="playfair">
                  <Playfair />
                </Tab.Pane>
                <Tab.Pane eventKey="super">Super Encryption</Tab.Pane>
                <Tab.Pane eventKey="affine">Affine Cipher</Tab.Pane>
                <Tab.Pane eventKey="hill">Hill Cipher</Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </div>
  );
}

export default App;
