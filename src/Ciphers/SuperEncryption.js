import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { readFileAsString, downloadFile } from "./helper";

export default class SuperEncryption extends React.PureComponent {
  constructor(props) {
    super(props);
    this.action = null;
    this.state = {
      alphabets: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ],
      numOfChar: 26,
      result: null,
    };
  }

  mod(n, m) {
    return ((n % m) + m) % m;
  }

  vigenereEncrypt(text, key) {
    const { alphabets, numOfChar } = this.state;
    let result = "";
    for (let i = 0; i < text.length; i++) {
      let row = alphabets.indexOf(key[i]);
      let col = alphabets.indexOf(text[i]);
      result += alphabets[(col + row) % numOfChar];
    }
    return result;
  }

  vigenereDecrypt(text, key) {
    const { alphabets, numOfChar } = this.state;
    let result = "";
    for (let i = 0; i < text.length; i++) {
      let row = alphabets.indexOf(key[i]);
      let col = alphabets.indexOf(text[i]);
      result += alphabets[this.mod(col - row, numOfChar)];
    }
    return result.toLowerCase();
  }

  transposeEncrypt = (text, kvalue) => {
    let length = text.length;

    let encryptMatrix = [];

    for (let i = 0; i < kvalue; i++) {
      encryptMatrix.push([]);
    }

    let i = 0;

    while (i < length) {
      for (let j = 0; j < kvalue; j++) {
        encryptMatrix[j].push(text.charAt(i));
        i++;
      }
    }

    let result = "";
    var index;
    for (index in encryptMatrix) {
      let arrayString = encryptMatrix[index]
        .toString()
        .replace(/,/gi, "")
        .toUpperCase();
      result = result + arrayString;
    }
    return result;
  };

  transposeDecrypt = (text, kvalue) => {
    let length = text.length;

    let decryptMatrix = [];

    let n = Math.ceil(length / kvalue);

    for (let i = 0; i < n; i++) {
      decryptMatrix.push([]);
    }

    let i = 0;

    while (i < length) {
      for (let j = 0; j < n; j++) {
        if (j * kvalue + decryptMatrix[j].length < length) {
          decryptMatrix[j].push(text.charAt(i));
          i++;
        } else {
          decryptMatrix[j].push("");
        }
      }
    }

    let result = "";
    var index;
    for (index in decryptMatrix) {
      let arrayString = decryptMatrix[index]
        .toString()
        .replace(/,/gi, "")
        .toUpperCase();
      result = result + arrayString;
    }
    return result;
  };

  encrypt = (text, key, kvalue, resultOption) => {
    let partialResult = this.vigenereEncrypt(text, key);
    let result = this.transposeEncrypt(partialResult, kvalue);
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

  decrypt = (text, key, kvalue, resultOption) => {
    let partialResult = this.transposeDecrypt(text, kvalue);
    let result = this.vigenereDecrypt(partialResult, key);
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
    let key = event.target.key.value.toUpperCase();
    let kvalue = event.target.kvalue.value;
    let resultOption = event.target.resultOption.value;

    if (event.target.inputFile.files.length > 0) {
      let file = event.target.inputFile.files[0];
      let result = readFileAsString(file);
      event.target.inputFile.value = "";
      result.then((res) => {
        let text = res
          .replace(/[^A-Za-z]/g, "")
          .toUpperCase();
        if (key.length < text.length) {
          let numOfRepeat =
            Math.ceil((text.length - key.length) / key.length) + 1;
          key = key.repeat(numOfRepeat).substr(0, text.length);
        } else {
          key = key.substr(0, text.length);
        }
        if (this.action === "encrypt") {
          this.encrypt(text, key, kvalue, resultOption);
        } else {
          this.decrypt(text, key, kvalue, resultOption);
        }
      });
    } else {
      let text = event.target.inputText.value
        .replace(/[^A-Za-z]/g, "")
        .toUpperCase();
      if (key.length < text.length) {
        let numOfRepeat =
          Math.ceil((text.length - key.length) / key.length) + 1;
        key = key.repeat(numOfRepeat).substr(0, text.length);
      } else {
        key = key.substr(0, text.length);
      }
      if (this.action === "encrypt") {
        this.encrypt(text, key, kvalue, resultOption);
      } else {
        this.decrypt(text, key, kvalue, resultOption);
      }
    }
  };

  render() {
    const { result } = this.state;
    return (
      <React.Fragment>
        <Row>
          <Col xs={12} className="content-start">
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="inputText">
                <Form.Label>Text</Form.Label>
                <Form.Control as="textarea" rows="6" />
              </Form.Group>

              <Form.Group>
                <Form.File id="inputFile" label="or upload file" />
              </Form.Group>

              <Form.Group controlId="key">
                <Form.Label>Key</Form.Label>
                <Form.Control type="text" required />
              </Form.Group>

              <Form.Group controlId="kvalue">
                <Form.Label>K value</Form.Label>
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
