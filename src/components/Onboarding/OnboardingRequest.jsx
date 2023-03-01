import React, { Component} from 'react'


class OnboardingRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (

            <>
        <div className="d-block text-center pb-20">
              <div className="onboardingRequest"><a href="/employee/on-boarding/new"><span>+</span>Onboarding Request</a></div>              
        </div>           
           </>
          );
    }
}
 
export default OnboardingRequest;