import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { readFile, downloadFile } from "./helper";

export default class Playfair extends React.PureComponent {
  constructor(props) {
    super(props);
    this.action = null;
    this.state = {
      result: null,
    };
  }

  replaceUnusableChar = (string) => {
    var newString = string;
    newString = newString.replace(/j/gi, "i");
    return newString;
  };

  insertX = (string) => {
    var newString = "";
    let i = 0;

    while (i < string.length) {
      let letter1 = string.charAt(i);
      let letter2 = string.charAt(i + 1);

      if (letter2 === "" || letter1 === letter2) {
        newString = newString + letter1 + "x";
        i += 1;
      } else {
        newString = newString + letter1 + letter2;
        i += 2;
      }
    }

    return newString;
  };

  createBigrams = (string) => {
    let oldString = string;
    var bigramArray = [];

    for (let i = 0; i < oldString.length; i += 2) {
      let letter1 = oldString.charAt(i);
      let letter2 = oldString.charAt(i + 1);
      let bigram = letter1 + letter2;
      bigramArray.push(bigram);
    }

    return bigramArray;
  };

  createKeyMatrix = (key) => {
    let alphabets = "abcdefghiklmnopqrstuvwxyz";
    let keyArray = [];

    for (let i = 0; i < key.length; i++) {
      let keyChar = key.charAt(i);
      if (!keyArray.includes(keyChar)) {
        keyArray.push(keyChar);
      }
    }

    for (let i = 0; i < alphabets.length; i++) {
      let letter = alphabets.charAt(i);
      if (!keyArray.includes(letter)) {
        keyArray.push(letter);
      }
    }

    var keyMatrix = [];

    for (let i = 0; i < 5; i++) {
      let array = keyArray.splice(0, 5);
      keyMatrix.push(array);
    }

    return keyMatrix;
  };

  encrypt = (text, key) => {
    let plaintext = this.replaceUnusableChar(text);
    plaintext = this.insertX(plaintext);
    let bigramArray = this.createBigrams(plaintext);
    let keyMatrix = this.createKeyMatrix(key);

    let encryptedBigrams = [];
    bigramArray.map((item) => {
      let letter1 = item.charAt(0);
      let letter2 = item.charAt(1);

      let letter1Col = -1;
      let letter2Col = -1;
      let letter1Row = 0;
      let letter2Row = 0;
      let letter1Found = false;
      let letter2Found = false;

      while (letter1Row < 5 && !letter1Found) {
        if (keyMatrix[letter1Row].indexOf(letter1) !== -1) {
          letter1Found = true;
          letter1Col = keyMatrix[letter1Row].indexOf(letter1);
        } else {
          letter1Row += 1;
        }
      }

      while (letter2Row < 5 && !letter2Found) {
        if (keyMatrix[letter2Row].indexOf(letter2) !== -1) {
          letter2Found = true;
          letter2Col = keyMatrix[letter2Row].indexOf(letter2);
        } else {
          letter2Row += 1;
        }
      }

      let letter1Encrypt = "";
      let letter2Encrypt = "";

      if (letter1Row === letter2Row) {
        letter1Encrypt = keyMatrix[letter1Row][(letter1Col + 1) % 5];
        letter2Encrypt = keyMatrix[letter2Row][(letter2Col + 1) % 5];
      } else if (letter1Col === letter2Col) {
        letter1Encrypt = keyMatrix[(letter1Row + 1) % 5][letter1Col];
        letter2Encrypt = keyMatrix[(letter2Row + 1) % 5][letter2Col];
      } else {
        letter1Encrypt = keyMatrix[letter1Row][letter2Col];
        letter2Encrypt = keyMatrix[letter2Row][letter1Col];
      }

      let encryptBigram = letter1Encrypt + letter2Encrypt;
      encryptedBigrams.push(encryptBigram);
    });

    let result = encryptedBigrams.toString().replace(/,/gi, "").toUpperCase();
    this.setState({
      result: result,
    });
    this.resultText.value = result;
  };

  decrypt = (text, key) => {
    let bigramArray = this.createBigrams(text);
    let keyMatrix = this.createKeyMatrix(key);

    let decryptedBigrams = [];
    bigramArray.map((item) => {
      let letter1 = item.charAt(0);
      let letter2 = item.charAt(1);

      let letter1Col = -1;
      let letter2Col = -1;
      let letter1Row = 0;
      let letter2Row = 0;
      let letter1Found = false;
      let letter2Found = false;

      while (letter1Row < 5 && !letter1Found) {
        if (keyMatrix[letter1Row].indexOf(letter1) !== -1) {
          letter1Found = true;
          letter1Col = keyMatrix[letter1Row].indexOf(letter1);
        } else {
          letter1Row += 1;
        }
      }

      while (letter2Row < 5 && !letter2Found) {
        if (keyMatrix[letter2Row].indexOf(letter2) !== -1) {
          letter2Found = true;
          letter2Col = keyMatrix[letter2Row].indexOf(letter2);
        } else {
          letter2Row += 1;
        }
      }

      let letter1Decrypt = "";
      let letter2Decrypt = "";

      if (letter1Row === letter2Row) {
        letter1Decrypt = keyMatrix[letter1Row][(letter1Col - 1 + 5) % 5];
        letter2Decrypt = keyMatrix[letter2Row][(letter2Col - 1 + 5) % 5];
      } else if (letter1Col === letter2Col) {
        letter1Decrypt = keyMatrix[(letter1Row - 1 + 5) % 5][letter1Col];
        letter2Decrypt = keyMatrix[(letter2Row - 1 + 5) % 5][letter2Col];
      } else {
        letter1Decrypt = keyMatrix[letter1Row][letter2Col];
        letter2Decrypt = keyMatrix[letter2Row][letter1Col];
      }

      let decryptBigram = letter1Decrypt + letter2Decrypt;
      decryptedBigrams.push(decryptBigram);
    });

    let result = decryptedBigrams.toString().replace(/,/gi, "").toLowerCase();
    this.setState({
      result: result,
    });
    this.resultText.value = result;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let key = event.target.key.value.toLowerCase();

    if (event.target.inputFile.files.length > 0) {
      let file = event.target.inputFile.files[0];
      let result = readFile(file);
      event.target.inputFile.value = "";
      result.then((res) => {
        let text = res.replace(/[^A-Za-z]/g, "").toLowerCase();
        if (this.action === "encrypt") {
          this.encrypt(text, key);
        } else {
          this.decrypt(text, key);
        }
      });
    } else {
      let text = event.target.inputText.value
        .replace(/[^A-Za-z]/g, "")
        .toLowerCase();
      if (this.action === "encrypt") {
        this.encrypt(text, key);
      } else {
        this.decrypt(text, key);
      }
    }
  };

  render() {
    const { result } = this.state;
    return (
      <React.Fragment>
        <Row>
          <Col xs={6} className="content-start">
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
          ;
        </Row>
      </React.Fragment>
    );
  }
}
