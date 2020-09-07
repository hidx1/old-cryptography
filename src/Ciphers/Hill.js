import React from 'react';

import {
  Button,
  Col,
  Form,
  Row,
} from 'react-bootstrap';

import {
  readFileAsString,
  downloadFile,
  mod,
  modInverse,
} from './helper';

import { create, all } from 'mathjs';
const config = {};
const math = create(all, config);

export default class Hill extends React.PureComponent {
  constructor(props) {
    super(props);
    this.action = null;
    this.state={
      alphabets: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
                  "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
                  "U", "V", "W", "X", "Y", "Z"],
      numOfChar: 26,
      result: null,
    }
  }

  createKeyMatrix(keyText) {
    const { alphabets } = this.state;
    let key = [];
    for (let i = 0; i < 9; i++) {
      key[i] = alphabets.indexOf(keyText[i]);
    }

    return math.matrix([[key[0], key[1], key[2]], 
                        [key[3], key[4], key[5]], 
                        [key[6], key[7], key[8]]]);
  }

  createPlainMatrix(plainText) {
    const { alphabets } = this.state;
    let plain = [];
    for (let i = 0; i < 3; i++) {
      plain[i] = alphabets.indexOf(plainText[i]);
    }

    return math.matrix([
      [plain[0]], 
      [plain[1]], 
      [plain[2]]
    ]);
  }

  createInverseMatrix(keyMatrix) {
    const { alphabets, numOfChar } = this.state;
    const a = math.subset(keyMatrix, math.index(0, 0));
    const b = math.subset(keyMatrix, math.index(0, 1));
    const c = math.subset(keyMatrix, math.index(0, 2));
    const d = math.subset(keyMatrix, math.index(1, 0));
    const e = math.subset(keyMatrix, math.index(1, 1));
    const f = math.subset(keyMatrix, math.index(1, 2));
    const g = math.subset(keyMatrix, math.index(2, 0));
    const h = math.subset(keyMatrix, math.index(2, 1));
    const i = math.subset(keyMatrix, math.index(2, 2));
    const A = (e*i) - (h*f);
    const B = -((d*i) - (f*g));
    const C = (d*h) - (e*g);
    const D = -((b*i) - (h*c));
    const E = (a*i) - (c*g);
    const F = - ((a*h) - (b*g));
    const G = (b*f) - (e*c);
    const H = - ((a*f) - (c*d));
    const I = (a*e) - (b*d);
    const det = a*A + b*B + c*C;
    const moddedDet = mod(det, numOfChar);
    const inverseDet = modInverse(moddedDet, numOfChar);
    const mat = math.matrix([[A, B, C], 
                            [D, E, F], 
                            [G, H, I]]);
    const transpose = math.transpose(mat);
    let result = ""
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const elem = math.subset(transpose, math.index(i,j));
        const moddedElem = mod(elem, numOfChar);
        const index = (inverseDet * moddedElem) % numOfChar;
        const char = alphabets[index];
        result += char;
      }
    }
    const inverse = this.createKeyMatrix(result);
    return inverse;
  }

  encrypt(plainText, keyMatrix, resultOption) {
    const { alphabets, numOfChar } = this.state;
    let result = "";
    for (let i = 0; i < plainText.length; i+=3) {
      const plainMatrix = this.createPlainMatrix(plainText.substr(i, 3));
      const resultMatrix = math.multiply(keyMatrix, plainMatrix)
      for (let j = 0; j < 3; j++) {
        result += alphabets[(math.subset(resultMatrix, math.index(j,0))) % numOfChar];
        if (resultOption === "secondOption") if (result.length % 6 === 5) result += " ";
      }
    }
    this.setState({
      result: result,
    });
    this.resultText.value = result;
  }

  decrypt(cipherText, keyMatrix, resultOption) {
    const { alphabets, numOfChar } = this.state;
    let result = "";
    const inverseMatrix = this.createInverseMatrix(keyMatrix);
    for (let i = 0; i < cipherText.length; i += 3) {
      const cipherMatrix = this.createPlainMatrix(cipherText.substr(i, 3));
      const resultMatrix = math.multiply(inverseMatrix, cipherMatrix);
      for (let j = 0; j < 3; j++) {
        result += alphabets[(math.subset(resultMatrix, math.index(j,0))) % numOfChar];
        if (resultOption === "secondOption") if (result.length % 6 === 5) result += " ";
      }
    }
    result = result.toLowerCase();
    this.setState({
      result: result,
    });
    this.resultText.value = result;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let key = event.target.key.value.toUpperCase();
    let resultOption = event.target.resultOption.value;

    if (event.target.inputFile.files.length > 0) {
      let file = event.target.inputFile.files[0];
      let result = readFileAsString(file);
      event.target.inputFile.value = "";
      result.then(res => {
        let text = res.replace(/[^A-Za-z]/g, "").toUpperCase();
        if (text.length % 3 === 0 && key.length === 9) {
          const keyMatrix = this.createKeyMatrix(key);
          
          if (this.action === "encrypt") {
            this.encrypt(text, keyMatrix, resultOption);
          } else {
            this.decrypt(text, keyMatrix, resultOption);
          }
        } else {
          alert("Plaintext length must be divisible by 3!");
        }
      });
    } else {
      let text = event.target.inputText.value.replace(/[^A-Za-z]/g, "").toUpperCase();
      if (text.length % 3 === 0 && key.length === 9) {
        const keyMatrix = this.createKeyMatrix(key);
        
        if (this.action === "encrypt") {
          this.encrypt(text, keyMatrix, resultOption);
        } else {
          this.decrypt(text, keyMatrix, resultOption);
        }
      } else {
        alert("Plaintext length must be divisible by 3!");
      }
    }
  }

  render() {
    const { result } = this.state;
    return (
      <React.Fragment>
        <Row className="margin-bottom-md">
          <Col xs={12} className="content-start">
            <Form onSubmit={this.handleSubmit}>

              <Form.Group controlId="inputText">
                <Form.Label>Text</Form.Label>
                <Form.Control as="textarea" rows="6"/>
              </Form.Group>

              <div className="text-danger margin-bottom-md bold">Note: Plaintext length must be divisible by 3!</div>

              <Form.Group>
                <Form.File id="inputFile" label="or upload file" />
              </Form.Group>

              <Form.Group controlId="key">
                <Form.Label>Key</Form.Label> 
                <Form.Control type="text" required/>
              </Form.Group>

              <div className="text-danger margin-bottom-md bold">Note: Key length must be 9!</div>

              <Form.Group controlId="resultOption">
                <Form.Label>Result Option</Form.Label>
                <Form.Control as="select">
                  <option value="firstOption">No Spaces</option>
                  <option value="secondOption">5-word Group</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="resultText">
                <Form.Label>Result</Form.Label>
                <Form.Control as="textarea" rows="6" ref={(ref)=>{this.resultText=ref}}/>
              </Form.Group>

              <Button 
                variant="success"
                type="button"
                className="margin-bottom-xs"
                onClick={() => downloadFile("result", result)}
              > Download Result
              </Button>
              
              <Button 
                variant="primary"
                type="submit"
                className="full-width margin-bottom-xs"
                onClick={() => this.action="encrypt"}
              > Encrypt
              </Button>

              <Button
                variant="secondary"
                type="submit"
                className="full-width"
                onClick={() => this.action="decrypt"}
              > Decrypt
              </Button>
            </Form>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}