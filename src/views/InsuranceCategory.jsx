/* eslint-disable */
import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import InsuranceTPA from '../components/Insurance/InsuranceTPA'

class InsuranceCategory extends Component {
  constructor() {
    super();
    this.state = {
       };
  }

  render() {
   
    return (
      <>
      <div className="p-2 flex-fill d-flex flex-column page-fade-enter-done">
          <Row>
            <div className="col-sm-12">
              <Col>
                <h4>Add Network & TPA </h4>
              </Col>
            </div>

            <div className="col-sm-12">
              <InsuranceTPA />
            </div>

           

           
          </Row>
        </div>
        </>
    );
  }
}

export default InsuranceCategory;
