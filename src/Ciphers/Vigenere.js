import React from 'react';

import {
  Button,
  Col,
  Form,
  Row,
  Table,
} from 'react-bootstrap';

export default class Vigenere extends React.PureComponent {
  constructor(props) {
    super(props);
    this.action = null;
    this.state={
      alphabets: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
                  "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
                  "U", "V", "W", "X", "Y", "Z"],
      rows: null,
      // table: null,
      numOfChar: 26,
    }
  }

  componentDidMount() {
    this.generateRow(26);
    // this.generateTable(26);
  }

  generateRow(numOfChar) {
    let rows = [];

    for (let i = 0; i < numOfChar; i++) {
      rows[i] = i;
    }

    this.setState({
      rows: rows,
    });
  }

  // generateTable(numOfChar) {
  //   let row = 0;
  //   let table = [];
  //   let stop = false;

  //   for (let i = 0; row < numOfChar; i++) {
  //     if (i % numOfChar === 0 && i !== 0) {
  //       row++;
  //       i = 0;
  //       if (row === numOfChar) {
  //         stop = true;
  //       } 
  //     }
  //     if (!stop) table[row*numOfChar + i] = this.state.alphabets[(row+i)%numOfChar];
  //   }

  //   this.setState({
  //     table: table,
  //   });
  // }

  mod(n, m) {
    return ((n % m) + m) % m;
  }

  encrypt(plainText, key) {
    const { alphabets, numOfChar } = this.state;
    let result = "";
    for (let i = 0; i < plainText.length; i++) {
      let row = alphabets.indexOf(key[i]);
      let col = alphabets.indexOf(plainText[i]);
      result += alphabets[(col+row)%numOfChar];
      if (i > 0 && i % 5 === 0) result += " ";
    }
    this.resultText.value = result;
  }

  decrypt(cipherText, key) {
    const { alphabets, numOfChar } = this.state;
    let result = "";
    for (let i = 0; i < cipherText.length; i++) {
      let row = alphabets.indexOf(key[i]);
      let col = alphabets.indexOf(cipherText[i]);
      result += alphabets[this.mod(col-row, numOfChar)];
      if (i > 0 && i % 5 === 0) result += " ";
    }
    this.resultText.value = result.toLowerCase();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let text = event.target.inputText.value.replace(/[^A-Za-z]/g, "").toUpperCase();
    let key = event.target.key.value.toUpperCase();
    if (key.length < text.length) {
      let numOfRepeat = Math.ceil((text.length-key.length)/key.length)+1;
      key = key.repeat(numOfRepeat).substr(0, text.length);
    } else {
      key = key.substr(0, text.length);
    }
    if (this.action === "encrypt") {
      this.encrypt(text, key);
    } else {
      this.decrypt(text, key);
    }
  }

  render() {
    const { alphabets, rows, numOfChar } = this.state;
    return (
      <React.Fragment>
        <Row>
          <Col xs={6} className="content-start">
            <Form onSubmit={this.handleSubmit}>

              <Form.Group controlId="inputText">
                <Form.Label>Text</Form.Label>
                <Form.Control as="textarea" rows="6"/>
              </Form.Group>

              <Form.Group controlId="key">
                <Form.Label>Key</Form.Label> 
                <Form.Control type="text"/>
              </Form.Group>

              <Form.Group controlId="resultText">
                <Form.Label>Result</Form.Label>
                <Form.Control as="textarea" rows="6" ref={(ref)=>{this.resultText=ref}}/>
              </Form.Group>
              
              <Button 
                variant="primary"
                type="submit"
                className="full-width"
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
          <Col xs={6} className="content-end">
          { rows ? 
            numOfChar === 26 ? (
              <Table striped hover responsive="xl" size="sm">
                <thead>
                  <tr>
                    <th></th>
                    { alphabets.map((char, idx) => {
                      return (
                        <th key={idx}>{char}</th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  { alphabets.map((char, idx) => {
                    return (
                      <tr key={idx}>
                        <td>{char}</td>
                        { rows.map(itr => {
                          return (
                            <td key={itr}>{alphabets[(idx+idx*numOfChar+itr)%numOfChar]}</td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            )
            : ""
          : ""}
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}