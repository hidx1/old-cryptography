import React from 'react';

import {
  Button,
  Col,
  Form,
  Row,
} from 'react-bootstrap';

import {
  convertArrayBufferToString,
  readFile,
  readFileAsString,
  downloadFile,
  downloadBinaryFile,
} from './helper';

export default class ExtendedVigenere extends React.PureComponent {
  constructor(props) {
    super(props);
    this.action = null;
    this.state={
      alphabets: null,
      table: null,
      numOfChar: 256,
      result: null,
      extension: null,
    }
  }

  componentDidMount() {
    this.generateASCIIAlphabets();
  }

  generateASCIIAlphabets() {
    let alphabets = [];
    for (let i = 0; i < 256; i++) {
      alphabets.push(String.fromCharCode(i));
    }
    this.setState({
      alphabets: alphabets,
    });
  }

  mod(n, m) {
    return ((n % m) + m) % m;
  }

  encrypt(plainText, key) {
    const { alphabets, numOfChar } = this.state;
    let result = "";
    let resultBuffer = null;
    resultBuffer = new Uint8Array(plainText.length);
    for (let i = 0; i < plainText.length; i++) {
      let row = alphabets.indexOf(key[i]);
      let col = null;
      if (typeof plainText === "string") {
        col = alphabets.indexOf(plainText[i]);
      } else {
        col = alphabets.indexOf(String.fromCharCode(plainText[i]))
      }
      resultBuffer[i] = (col+row)%numOfChar;
      result += alphabets[(col+row)%numOfChar];
    }
    this.setState({
      result: result,
      resultBuffer: resultBuffer,
    });
    this.resultText.value = result;
  }

  decrypt(cipherText, key) {
    const { alphabets, numOfChar } = this.state;
    let result = "";
    let resultBuffer = null;
    resultBuffer = new Uint8Array(cipherText.length);
    for (let i = 0; i < cipherText.length; i++) {
      let row = alphabets.indexOf(key[i]);
      let col = null;
      if (typeof cipherText === "string") {
        col = alphabets.indexOf(cipherText[i]);
      } else {
        col = alphabets.indexOf(String.fromCharCode(cipherText[i]));
      }
      resultBuffer[i] = (this.mod(col-row, numOfChar));
      result += alphabets[this.mod(col-row, numOfChar)];
    }
    this.setState({
      result: result,
      resultBuffer: resultBuffer,
    });
    this.resultText.value = result;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let key = event.target.key.value;
    let autoKey = event.target.autoKey.checked;

    if (event.target.inputFile.files.length > 0) {
      let file = event.target.inputFile.files[0];
      let fileType = file.name.split('.').pop();
      this.setState({
        extension: fileType,
      });
      let result = null;
      if (fileType === "txt") {
        result = readFileAsString(file);
      } else {
        result = readFile(file);
      }
      event.target.inputFile.value = "";
      result.then(res => {
        let buffer = null;
        let text = null;
        if (fileType === "txt") {
          buffer = res;
          text = res;
        } else {
          buffer = new Uint8Array(res);
          text = convertArrayBufferToString(buffer);
        }
        
        if (autoKey) {
          key += text;
          key = key.substr(0, text.length);
        } else {
          if (key.length < text.length) {
            let numOfRepeat = Math.ceil((text.length-key.length)/key.length)+1;
            key = key.repeat(numOfRepeat).substr(0, text.length);
          } else {
            key = key.substr(0, text.length);
          }
        }
        
        this.fullKey.value = key;
        
        if (this.action === "encrypt") {
          this.encrypt(buffer, key);
        } else {
          this.decrypt(buffer, key);
        }
      });
    } else {
      this.setState({
        extension: null,
      });
      let text = event.target.inputText.value;
      if (autoKey) {
        key += text;
        key = key.substr(0, text.length);
      } else {
        if (key.length < text.length) {
          let numOfRepeat = Math.ceil((text.length-key.length)/key.length)+1;
          key = key.repeat(numOfRepeat).substr(0, text.length);
        } else {
          key = key.substr(0, text.length);
        }
      }
      
      this.fullKey.value = key;
      
      if (this.action === "encrypt") {
        this.encrypt(text, key);
      } else {
        this.decrypt(text, key);
      }
    }
  }

  render() {
    const { result, resultBuffer, extension } = this.state;
    return (
      <React.Fragment>
        <Row className="margin-bottom-md">
          <Col xs={12} className="content-start">
            <Form onSubmit={this.handleSubmit}>

              <Form.Group controlId="inputText">
                <Form.Label>Text</Form.Label>
                <Form.Control as="textarea" rows="6"/>
              </Form.Group>

              <Form.Group>
                <Form.File id="inputFile" label="or upload file" />
              </Form.Group>

              <Form.Group controlId="key">
                <Form.Label>Key</Form.Label> 
                <Form.Control type="text" required/>
              </Form.Group>

              <Form.Group controlId="autoKey">
                <Form.Check type="checkbox" label="Use Auto-Key Vigenere Cipher"/>
              </Form.Group>

              <Form.Group controlId="fullKey">
                <Form.Label>Full Key</Form.Label> 
                <Form.Control type="text" readOnly ref={(ref)=>{this.fullKey=ref}}/>
              </Form.Group>

              <Form.Group controlId="resultText">
                <Form.Label>Result</Form.Label>
                <Form.Control as="textarea" rows="6" ref={(ref)=>{this.resultText=ref}}/>
              </Form.Group>

              <Button 
                variant="success"
                type="button"
                className="margin-bottom-xs margin-right-sm"
                onClick={() => downloadFile("result", result)}
              > Download Result as Text
              </Button>

              <Button 
                variant="success"
                type="button"
                className="margin-bottom-xs"
                onClick={() => downloadBinaryFile("result", extension, resultBuffer)}
              > Download Result as File
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
                className="full-width margin-bottom-lg"
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