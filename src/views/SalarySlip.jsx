import React, { Component } from 'react';
import PaySlip from '../components/Salary/PaySlip'

class SalarySlip extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
        
    }
    
    
    render() {
        return (
            <>   
<div className="p-2 flex-fill d-flex flex-column page-fade-enter-done">   

<PaySlip />

</div>


            </>
        );
    }
}

export default SalarySlip;