import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import OnboardingTable from '../components/Onboarding/OnboardingTable'
import OnboardingTab from '../components/Onboarding/OnboardingTab'

class Onboarding extends Component {
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
              <OnboardingTable />
            </div>

            {/* <div className="col-sm-12">
              <OnboardingTab />
            </div> */}
           
          </Row>
        </div>
      </>
    );
  }
}

export default Onboarding;
