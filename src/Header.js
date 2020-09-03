import React from 'react';
import {
  Jumbotron,
} from 'react-bootstrap';

function Header() {
  return (
    <Jumbotron className="background-navy border-radius-0">
      <div className="content-center heading-1 bold white">
        Old Cryptography App
      </div>
      <div className="content-center body-text white">
        by Kevin Sendjaja (13517023) and Nixon Andhika (13517059)
      </div>
    </Jumbotron>
  )
}

export default Header;