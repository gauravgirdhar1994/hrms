import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import CreateSalary from '../components/Payroll/CreateSalary'





class Salarygenrate extends Component {
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
                <h4>Salary Processing</h4>
              </Col>
            </div>

            <div className="col-sm-12">
              <CreateSalary />
            </div>
           
          </Row>
        </div>
      </>
    );
  }
}

export default Salarygenrate;
