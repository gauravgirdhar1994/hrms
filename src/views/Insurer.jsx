/* eslint-disable */
import React, { Component } from "react";
import InsurerList from '../components/Insurance/Insurer'

class Insurer extends Component {
  constructor() {
    super();
    this.state = {
       };
  }

  render() {
   
    return (
      <div>
       

        <InsurerList />
      </div>
    );
  }
}

export default Insurer;
