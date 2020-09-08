import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { readFileAsString, downloadFile, coprime } from "./helper";

export default class Affine extends React.PureComponent {
  constructor(props) {
    super(props);
    this.action = null;
    this.state = {
      result: null,
    };
  }

  encrypt = (text, mkey, bkey, resultOption) => {
    let m = parseInt(mkey);
    let b = parseInt(bkey);
    let result = "";
    let length = text.length;

    for (let i = 0; i < length; i++) {
      let res = ((m * (text.charCodeAt(i) - 65) + b) % 26) + 65;
      result = result + String.fromCharCode(res);
    }

    if (resultOption === "secondOption") {
      let newResult = "";
      for (let i = 0; i < result.length; i += 5) {
        newResult =
          newResult +
          result.charAt(i) +
          result.charAt(i + 1) +
          result.charAt(i + 2) +
          result.charAt(i + 3) +
          result.charAt(i + 4) +
          " ";
      }
      result = newResult;
    }
    this.setState({
      result: result,
    });
    this.resultText.value = result;
  };

  decrypt = (text, mkey, bkey, resultOption) => {
    let m = parseInt(mkey);
    let b = parseInt(bkey);
    let result = "";
    let length = text.length;
    let inverse = -1;
    let j = 0;

    while (j < 26 && inverse === -1) {
      let testInverse = (m * j) % 26;
      if (testInverse === 1) {
        inverse = j;
      } else {
        j++;
      }
    }

    for (let i = 0; i < length; i++) {
      console.log("char", text.charCodeAt(i));
      let res = inverse * (text.charCodeAt(i) - 65 - b);
      while (res < 0) {
        res += 26;
      }
      res = (res % 26) + 97;
      console.log("res", res);
      result = result + String.fromCharCode(res);
    }

    if (resultOption === "secondOption") {
      let newResult = "";
      for (let i = 0; i < result.length; i += 5) {
        newResult =
          newResult +
          result.charAt(i) +
          result.charAt(i + 1) +
          result.charAt(i + 2) +
          result.charAt(i + 3) +
          result.charAt(i + 4) +
          " ";
      }
      result = newResult;
    }
    this.setState({
      result: result,
    });
    this.resultText.value = result;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let mkey = event.target.mkey.value;
    let bkey = event.target.bkey.value;
    let resultOption = event.target.resultOption.value;

    if (event.target.inputFile.files.length > 0) {
      let file = event.target.inputFile.files[0];
      let result = readFileAsString(file);
      event.target.inputFile.value = "";
      result.then((res) => {
        let text = res.replace(/[^A-Za-z]/g, "").toUpperCase();
        if (coprime(parseInt(mkey, 26))) {
          if (this.action === "encrypt") {
            this.encrypt(text, mkey, bkey, resultOption);
          } else {
            this.decrypt(text, mkey, bkey, resultOption);
          }
        } else {
          alert("M Key must be relatively prime to 26!");
        }
      });
    } else {
      let text = event.target.inputText.value
        .replace(/[^A-Za-z]/g, "")
        .toUpperCase();
      if (coprime(parseInt(mkey), 26)) {
        if (this.action === "encrypt") {
          this.encrypt(text, mkey, bkey, resultOption);
        } else {
          this.decrypt(text, mkey, bkey, resultOption);
        }
      } else {
        alert("M Key must be relatively prime to 26!");
      }
    }
  };

  render() {
    const { result } = this.state;
    return (
      <React.Fragment>
        <Row className="margin-bottom-md">
          <Col xs={6} className="content-start">
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="inputText">
                <Form.Label>Text</Form.Label>
                <Form.Control as="textarea" rows="6" />
              </Form.Group>

              <Form.Group>
                <Form.File id="inputFile" label="or upload file" />
              </Form.Group>

              <Form.Group controlId="mkey">
                <Form.Label>M Key (Must be relatively prime to 26)</Form.Label>
                <Form.Control type="number" required />
              </Form.Group>

              <Form.Group controlId="bkey">
                <Form.Label>B Key</Form.Label>
                <Form.Control type="number" required />
              </Form.Group>

              <Form.Group controlId="resultOption">
                <Form.Label>Result Option</Form.Label>
                <Form.Control as="select">
                  <option value="firstOption">No Spaces</option>
                  <option value="secondOption">5-word Group</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="resultText">
                <Form.Label>Result</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="6"
                  ref={(ref) => {
                    this.resultText = ref;
                  }}
                />
              </Form.Group>

              <Button
                variant="success"
                type="button"
                className="margin-bottom-xs"
                onClick={() => downloadFile("result", result)}
              >
                {" "}
                Download Result
              </Button>

              <Button
                variant="primary"
                type="submit"
                className="full-width margin-bottom-xs"
                onClick={() => (this.action = "encrypt")}
              >
                {" "}
                Encrypt
              </Button>

              <Button
                variant="secondary"
                type="submit"
                className="full-width"
                onClick={() => (this.action = "decrypt")}
              >
                {" "}
                Decrypt
              </Button>
            </Form>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
