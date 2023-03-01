import React, { Component } from 'react';
import IncentiveComp from '../components/Payroll/Incentive'

class Incentive extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
        
    }
    
    
    render() {
        return (
            <>   
<div className="p-2 flex-fill d-flex flex-column page-fade-enter-done">   

<IncentiveComp />

</div>


            </>
        );
    }
}

export default Incentive;